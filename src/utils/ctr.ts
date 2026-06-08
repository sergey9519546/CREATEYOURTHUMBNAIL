import { ThumbnailConcept } from "../services/gemini.js";

export const getCTRScore = (concept: ThumbnailConcept) => {
  let score = 85;
  if (concept.hook?.toLowerCase().includes("curiosity")) score += 5;
  if (concept.psychology?.toLowerCase().includes("shock")) score += 3;
  if (concept.text_overlay?.split(" ").length <= 4) score += 5;
  return Math.min(score, 99);
};
