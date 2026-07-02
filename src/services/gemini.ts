import { ThumbnailConcept, StrategistResponse } from '../types';
import { sanitizeError } from '../utils/errors';
export type { ThumbnailConcept, StrategistResponse };


export async function getThumbnailConcepts(idea: string, niche: string, stylePreset: string, layout: string, palette: string, imageBase64?: string, likedConcepts?: ThumbnailConcept[]): Promise<StrategistResponse> {
  const response = await fetch("/api/thumbnail-concepts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea, niche, stylePreset, layout, palette, imageBase64, likedConcepts }),
  });

  if (!response.ok) {
    throw await handleGeminiError(response);
  }

  return response.json();
}

export async function refineConcept(originalConcept: ThumbnailConcept, feedback: string, compositeReferences?: ThumbnailConcept[], imageBase64?: string): Promise<ThumbnailConcept> {
  const response = await fetch("/api/refine-concept", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ originalConcept, feedback, compositeReferences, imageBase64 }),
  });

  if (!response.ok) {
    throw await handleGeminiError(response);
  }

  return response.json();
}

export async function generateThumbnailImage(prompt: string, niche: string, stylePreset: string, layout: string, palette: string, aspectRatio: string = "16:9", imageSize: string = "2K", imageBase64?: string, saturation: number = 100): Promise<string> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, niche, stylePreset, layout, palette, aspectRatio, imageSize, imageBase64, saturation }),
  });

  if (!response.ok) {
    throw await handleGeminiError(response);
  }

  const data = await response.json();
  return data.imageUrl;
}

async function handleGeminiError(response: Response): Promise<Error> {
  const errorData = await response.json();
  const errorMessage = errorData.error || "An unknown error occurred";
  return new Error(sanitizeError({ message: errorMessage }));
}
