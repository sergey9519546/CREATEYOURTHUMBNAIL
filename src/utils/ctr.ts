export const getCTRScore = (concept: { hook: string; psychology: string; text_overlay: string }): number => {
  let score = 85;
  if (concept.hook.toLowerCase().includes('curiosity')) score += 5;
  if (concept.psychology.toLowerCase().includes('shock')) score += 3;
  if (concept.text_overlay.split(' ').length <= 4) score += 5;
  return Math.min(score, 99);
};
