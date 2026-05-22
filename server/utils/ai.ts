import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

let aiClient: GoogleGenAI | null = null;

export const getAI = () => {
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

export const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : 'image/png';
};

// Cache system instructions — read files once, not on every request
let cachedSystemInstruction: string | null = null;
export const getSystemInstruction = () => {
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
