import { Type } from "@google/genai";
import { getAI, getSystemInstruction, getMimeType } from "../utils/ai.js";

export const generateConcepts = async ({ idea, niche, stylePreset, layout, palette, imageBase64, likedConcepts }: any) => {
  const ai = getAI();
  const nicheGuidance: Record<string, string> = {
    'General':       'Authenticity and relatability. Strong face-forward with genuine emotion. Curiosity gap is especially powerful here. Warm personal palette. Instant recognizability is mandatory.',
    'Gaming':        'Dynamic action compositions, freeze-frame mid-play reactions, red/green danger signals, neon on dark backgrounds, aggressive short text ("INSANE", "CLUTCH"). Show the emotional REACTION, not just gameplay.',
    'Finance':       'Dollar amounts/percentages as the absolute focal point. Green (gains) vs red (losses) contrast mandatory. Professional aesthetic with shocking numbers. Implied wealth transformation.',
    'Fitness':       'Before/after transformation split screens dominate this niche. Determination or triumph expression. Bold warm palette (orange/red/yellow). Specific timeframes in text. Body transformation is the hero subject.',
    'Education':     'Clarity over cleverness — never sacrifice comprehension for style. Blue/yellow trust-energy contrast. Visual metaphors simplifying complex ideas. "Aha moment" expression. Numbered indicators work well.',
    'Entertainment': 'Maximum emotional intensity. Scale contrasts (tiny vs huge, cheap vs expensive). Bright saturated primaries. Face communicates the REACTION not the action. Dollar amounts and stakes drive clicks.',
    'Tech':          'Product is the hero — hyper-sharp and perfectly lit. Human in soft focus provides emotional context. Apple-style clean aesthetic. Comparison/versus layouts perform extremely well.',
    'Food':          'Food is the hero — extreme macro showing texture, steam, and gloss. Warm golden lighting. Human taste-reaction face adds emotion. Before/after cooking transformations work well.',
  };

  const styleGuidance: Record<string, string> = {
    'Adventure':    'Diagonal lines suggesting motion. Hyper-saturated wide-angle drama. Subject looks mid-action or on the verge of acting. Scale drama (tiny person vs massive environment). Pure kinetic energy.',
    'Documentary':  'Moody cinematic chiaroscuro lighting. Slightly desaturated with teal/orange grade. Thoughtful serious expression. Negative space creates weight. One powerful image beats multiple competing elements.',
    'Review':       'Product/subject in perfect sharp studio focus. Clean light backgrounds. Side-by-side comparison layouts dominate. Expression: analytically impressed or skeptically evaluating. Professional and trustworthy.',
    'Minimalist':   'Bold negative space is intentional. Maximum 2 focal elements. Typography-forward: single large word or phrase. One bold accent color against white/black. Perfect isolated clean cutouts.',
    'Viral':        'Extreme reaction faces at maximum intensity. Over-saturated near-cartoon colors. Red/yellow arrows and callout circles. Meme-aware chaotic composition. Creates instant confusion and curiosity in viewer.',
    'Tutorial':     'Numbered step indicators or before/after split framing. Clean organized grid layout. Directional arrows and callouts. Subject visibly demonstrates the result. Warm approachable lighting.',
  };

  const contents: any[] = [
    `Video Idea/Title: ${idea}`,
    `Target Niche: ${niche || 'General'}`,
    `Visual Style: ${stylePreset || 'Adventure'}`,
    `Layout: ${layout || 'Default'}`,
    `Color Palette: ${palette || 'Vibrant'}`,
    `Niche Strategy: ${nicheGuidance[niche] || nicheGuidance['General']}`,
    `Style Directive: ${styleGuidance[stylePreset] || ''}`,
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

  const geminiTimeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API request timed out after 90s')), 90_000)
  );

  const response = await Promise.race([ai.models.generateContent({
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
  }), geminiTimeout]);

  if (!response.text) throw new Error("AI returned an empty response — try again");
  return JSON.parse(response.text);
};

export const refineConcept = async ({ originalConcept, feedback, compositeReferences, imageBase64 }: any) => {
  const ai = getAI();
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

  const geminiTimeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API request timed out after 90s')), 90_000)
  );
  const response = await Promise.race([ai.models.generateContent({
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
  }), geminiTimeout]);

  if (!response.text) throw new Error("AI returned an empty response — try again");
  return JSON.parse(response.text);
};
