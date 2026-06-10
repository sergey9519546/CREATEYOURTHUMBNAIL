import { ThumbnailConcept } from '../types.js';

export const getCTRScore = (concept: ThumbnailConcept): number => {
  let score = 85;
  const hook = concept.hook?.toLowerCase() || '';
  const psychology = concept.psychology?.toLowerCase() || '';
  const textOverlay = concept.text_overlay || '';

  if (hook.includes('curiosity')) score += 5;
  if (psychology.includes('shock')) score += 3;
  if (textOverlay.split(' ').length <= 4 && textOverlay.trim().length > 0) score += 5;

  return Math.min(score, 99);
};
