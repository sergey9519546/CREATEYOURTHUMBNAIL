import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { config } from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

config();

let aiClient: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiClient) {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 20) {
      apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    }
    if (!apiKey) throw new Error('GEMINI_API_KEY or GOOGLE_CLOUD_API_KEY environment variable is required');
    aiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  }
  return aiClient;
};

const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : 'image/png';
};

// Scrub internal details before sending errors to the client
const sanitizeError = (err: any): string => {
  const msg: string = err?.message || 'Unknown error';
  if (msg.includes('spending cap') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com.';
  }
  if (msg.includes('API_KEY_INVALID') || msg.includes('not valid') || msg.includes('API key')) {
    return 'Invalid API key. Please check your environment configuration.';
  }
  if (msg.includes('MINIMAX_API_KEY environment variable')) {
    return 'Image generation is not configured. MINIMAX_API_KEY is missing.';
  }
  // Strip URLs and stack traces, keep first line only, cap length
  return msg.replace(/https?:\/\/[^\s]*/g, '[url]').split('\n')[0].slice(0, 300);
};

// Simple in-memory rate limiter (per IP, sliding window)
const ipWindows = new Map<string, { count: number; resetAt: number }>();
const rateLimit = (maxPerMinute: number) => (req: any, res: any, next: any) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || 'unknown';
  const now = Date.now();
  const win = ipWindows.get(ip);
  if (!win || now > win.resetAt) {
    ipWindows.set(ip, { count: 1, resetAt: now + 60_000 });
    return next();
  }
  if (win.count >= maxPerMinute) {
    return res.status(429).json({ error: 'Too many requests — please wait a minute before trying again.' });
  }
  win.count++;
  next();
};

// Cache system instructions — read files once, not on every request
let cachedSystemInstruction: string | null = null;
const getSystemInstruction = () => {
  if (cachedSystemInstruction) return cachedSystemInstruction;
  try {
    const skillContent = fs.readFileSync(path.join(process.cwd(), "SKILL.md"), "utf-8");
    const rulesContent = fs.readFileSync(path.join(process.cwd(), "thumbnail-rules.md"), "utf-8");
    cachedSystemInstruction = `You are the YouTube Thumbnail Strategist, a World-Class Click Engineer.
Your identity, mission, and workflow are defined in the SKILL DEFINITION below.
Your core strategies are derived from the MASTER LOGIC BLUEPRINT (thumbnail-rules.md).

CRITICAL LOGIC PATCH (SUBJECT INTEGRITY & SAFETY):
- If the user provides an image (imageBase64), that image contains the SUBJECT/CHARACTER of the video.
- You MUST ensure the generated thumbnail concepts and prompts revolve 100% around the likeness, pose, and identity of the subject in the uploaded image.
- Do NOT replace the subject with a generic character if an image is provided.
- SAFETY GUARDRAIL: Avoid generating prompts that include extreme gore, explicit violence, illegal acts, or sexually suggestive content.

CORE KNOWLEDGE & RULES:
${rulesContent}

SKILL DEFINITION:
${skillContent}

When generating concepts, you MUST strictly follow the Response Template defined in the SKILL DEFINITION.
Ensure your image_generation_prompt is detailed and follows the Image Generation Guidelines in the SKILL DEFINITION.`;
    return cachedSystemInstruction;
  } catch (error) {
    console.error("Error loading instruction files:", error);
    return "You are a YouTube Thumbnail Strategist. Use industry best practices to generate high-CTR thumbnail concepts.";
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.post("/api/thumbnail-concepts", rateLimit(10), async (req, res) => {
    try {
      const ai = getAI();
      const { idea, niche, stylePreset, layout, palette, imageBase64, likedConcepts } = req.body;

      // Input validation
      if (!idea || typeof idea !== 'string' || !idea.trim()) {
        return res.status(400).json({ error: 'Video idea is required.' });
      }
      if (idea.length > 2000) {
        return res.status(400).json({ error: 'Video idea must be under 2000 characters.' });
      }
      if (likedConcepts !== undefined && !Array.isArray(likedConcepts)) {
        return res.status(400).json({ error: 'likedConcepts must be an array.' });
      }
      if (Array.isArray(likedConcepts) && likedConcepts.length > 20) {
        return res.status(400).json({ error: 'Too many liked concepts (max 20).' });
      }

      const contents: any[] = [
        `Video Idea/Title: ${idea}`,
        `Requested Niche: ${niche || 'General'}`,
        `Requested Style Preset: ${stylePreset || 'Adventure'}`,
        `Requested Layout: ${layout || 'Default'}`,
        `Requested Palette: ${palette || 'Vibrant'}`
      ];

      if (Array.isArray(likedConcepts) && likedConcepts.length > 0) {
        contents.push(`USER'S PREVIOUSLY LIKED/REFERENCED CONCEPTS (Use these as strong inspiration):\n${JSON.stringify(likedConcepts.map((c: any) => ({
          name: c.concept_name,
          trigger: c.psychology,
          hook: c.hook,
          colors: c.color_strategy,
          prompt: c.image_generation_prompt
        })), null, 2)}`);
      }

      if (imageBase64 && typeof imageBase64 === 'string') {
        contents.push({
          inlineData: {
            mimeType: getMimeType(imageBase64),
            data: imageBase64.substring(imageBase64.indexOf(',') + 1)
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: getSystemInstruction(),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              video_context_summary: { type: Type.STRING },
              niche_applied: { type: Type.STRING },
              style_preset_applied: { type: Type.STRING },
              thumbnails: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    concept_number: { type: Type.INTEGER },
                    concept_name: { type: Type.STRING },
                    hook: { type: Type.STRING },
                    layout: { type: Type.STRING },
                    text_overlay: { type: Type.STRING },
                    color_strategy: { type: Type.STRING },
                    psychology: { type: Type.STRING },
                    ctr_explanation: { type: Type.STRING },
                    image_generation_prompt: { type: Type.STRING }
                  },
                  required: ["concept_number", "concept_name", "hook", "layout", "text_overlay", "color_strategy", "psychology", "ctr_explanation", "image_generation_prompt"]
                }
              },
              optimization_notes: { type: Type.STRING },
              chat_prompt: { type: Type.STRING }
            },
            required: ["video_context_summary", "niche_applied", "style_preset_applied", "thumbnails", "optimization_notes", "chat_prompt"]
          }
        }
      });

      if (!response.text) throw new Error("AI returned an empty response — try again");
      try {
        res.json(JSON.parse(response.text));
      } catch {
        throw new Error("AI returned malformed JSON — please try again");
      }
    } catch (error: any) {
      console.error("Error in /api/thumbnail-concepts:", error);
      const msg = sanitizeError(error);
      res.status(error.status === 429 ? 429 : 500).json({ error: msg });
    }
  });

  app.post("/api/refine-concept", rateLimit(20), async (req, res) => {
    try {
      const ai = getAI();
      const { originalConcept, feedback, compositeReferences, imageBase64 } = req.body;

      // Input validation
      if (!originalConcept || typeof originalConcept !== 'object') {
        return res.status(400).json({ error: 'originalConcept is required.' });
      }
      if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
        return res.status(400).json({ error: 'Feedback is required.' });
      }
      if (feedback.length > 1000) {
        return res.status(400).json({ error: 'Feedback must be under 1000 characters.' });
      }

      const contents: any[] = [
        `Original Concept JSON: ${JSON.stringify(originalConcept)}`,
        `User Feedback for Refinement: ${feedback}`,
      ];

      if (Array.isArray(compositeReferences) && compositeReferences.length > 0) {
        contents.push(`Composite References — blend style/layout elements from these: ${JSON.stringify(compositeReferences.map((c: any) => ({ name: c.concept_name, prompt: c.image_generation_prompt })))}`);
      }

      contents.push(`Task: Update the image_generation_prompt and other relevant fields based on the user feedback while strictly adhering to the MASTER LOGIC BLUEPRINT.`);

      if (imageBase64 && typeof imageBase64 === 'string') {
        contents.push({
          inlineData: {
            mimeType: getMimeType(imageBase64),
            data: imageBase64.substring(imageBase64.indexOf(',') + 1)
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: getSystemInstruction(),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              concept_number: { type: Type.INTEGER },
              concept_name: { type: Type.STRING },
              hook: { type: Type.STRING },
              layout: { type: Type.STRING },
              text_overlay: { type: Type.STRING },
              color_strategy: { type: Type.STRING },
              psychology: { type: Type.STRING },
              ctr_explanation: { type: Type.STRING },
              image_generation_prompt: { type: Type.STRING },
              refinement_notes: { type: Type.STRING }
            },
            required: ["concept_number", "concept_name", "hook", "layout", "text_overlay", "color_strategy", "psychology", "ctr_explanation", "image_generation_prompt", "refinement_notes"]
          }
        }
      });

      if (!response.text) throw new Error("AI returned an empty response — try again");
      try {
        res.json(JSON.parse(response.text));
      } catch {
        throw new Error("AI returned malformed JSON — please try again");
      }
    } catch (error: any) {
      console.error("Error in /api/refine-concept:", error);
      res.status(500).json({ error: sanitizeError(error) });
    }
  });

  app.post("/api/generate-image", rateLimit(15), async (req, res) => {
    try {
      const { prompt, niche, stylePreset, layout, palette, aspectRatio, saturation } = req.body;

      // Input validation
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }
      if (prompt.length > 4000) {
        return res.status(400).json({ error: 'Prompt must be under 4000 characters.' });
      }
      const validAspectRatios = ['16:9', '9:16', '1:1'];
      const safeAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '16:9';

      // Keys match the niche IDs sent by the client
      const nicheModifiers: Record<string, string> = {
        'Gaming': "Dynamic lighting, red/green danger indicators, extreme zooms on mid-action reaction faces, short exclamation text.",
        'Finance': "Large dollar amounts or percentages as the absolute focal point. Green for gains, red for losses. Clean, professional aesthetic with a subtle shock factor.",
        'Fitness': "Transformation compositions (before/after split screens), determination/success expressions, bold warm colors, action text.",
        'Education': "Clarity over cleverness. Bold blue/yellow contrast (Trust + Energy). Step indicators, clean and organized layout.",
        'Entertainment': "Diagonal compositions to create visual tension, heavily saturated warm colors, maximum facial emotion.",
        'Tech': "The product is the hero, heavily sharpened and in ultra-focus. Human subject in the background with soft focus. Clean studio lighting, sleek Apple-style color grading."
      };

      const stylePresets: Record<string, string> = {
        'Adventure': "Hyper-saturated action shot, extreme wide-angle lens distortion, vibrant lighting, volumetric fog, high-energy composition.",
        'Documentary': "Dramatic moody lighting, cinematic mystery aesthetic, dark vignetting, high local contrast, film grain, blurred storytelling background.",
        'Review': "Minimalist high-tech aesthetic, ultra-sharp macro focus on product, clean studio lighting, soft shadows, professional tech-enthusiast vibe.",
        'Minimalist': "Clean composition, minimal elements, strong negative space, single focal point, elegant typography."
      };

      const colorPairings: Record<string, string> = {
        'Vibrant': 'Yellow+Black (Urgency)',
        'Minimalist': 'Blue+Yellow (Trust)',
        'Dark Mode': 'Red+White (Drama)',
        'High Contrast': 'Orange+Dark Blue (Excitement)'
      };

      const enhancedPrompt = `[BASE PROMPT: ${prompt}, Layout: ${layout || 'Default'}, Cinematic Lighting, Professional Photography, Saturation: ${saturation || 100}%] + [NICHE MODIFIER: ${nicheModifiers[niche] || ''}] + [STYLE PRESET: ${stylePresets[stylePreset] || ''}] + [HOOK & COLOR: Curiosity Gap, ${colorPairings[palette] || 'Red+Green (Comparison)'}] + [TYPOGRAPHY: Bold, readable text, 3D effect] + [CTR PRINCIPLES: Clear emotion, High Contrast]`;

      const minimaxApiKey = process.env.MINIMAX_API_KEY;
      if (!minimaxApiKey) {
        throw new Error('MINIMAX_API_KEY environment variable is required for image generation');
      }

      // 60s timeout for image generation
      const response = await fetch("https://api.minimax.io/v1/image_generation", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${minimaxApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "image-01",
          prompt: enhancedPrompt,
          aspect_ratio: safeAspectRatio,
          response_format: "url",
          n: 1,
          prompt_optimizer: true
        }),
        signal: AbortSignal.timeout(60_000)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Image generation failed (${response.status})`);
      }

      const data: any = await response.json();

      if (data?.base_resp?.status_code && data.base_resp.status_code !== 0) {
        throw new Error(`Image generation failed: ${data.base_resp.status_msg}`);
      }

      const rawUrl =
        data?.data?.image_urls?.[0] ||
        data?.data?.[0]?.url ||
        data?.images?.[0]?.url ||
        data?.output_image_urls?.[0];

      if (!rawUrl) {
        console.error("Unexpected Minimax response shape:", JSON.stringify(data));
        throw new Error("No image URL returned from image generation service");
      }

      const httpsUrl = rawUrl.replace(/^http:\/\//, 'https://');

      // Download the image and return as base64 data URL so it never expires
      const imgResponse = await fetch(httpsUrl, { signal: AbortSignal.timeout(30_000) });
      if (!imgResponse.ok) throw new Error("Failed to fetch generated image");
      const imgBuffer = await imgResponse.arrayBuffer();
      const mimeType = imgResponse.headers.get('content-type') || 'image/jpeg';
      const base64 = Buffer.from(imgBuffer).toString('base64');

      res.json({ imageUrl: `data:${mimeType};base64,${base64}` });
    } catch (error: any) {
      console.error("Error in /api/generate-image:", error);
      res.status(500).json({ error: sanitizeError(error) });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
