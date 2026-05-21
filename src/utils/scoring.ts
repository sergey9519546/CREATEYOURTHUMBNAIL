export const getCTRScore = (hook: string, psychology: string, textOverlay: string): number => {
  let score = 85;
  if (hook.toLowerCase().includes('curiosity')) score += 5;
  if (psychology.toLowerCase().includes('shock')) score += 3;
  if (textOverlay.split(' ').length <= 4) score += 5;
  return Math.min(score, 99);
};
