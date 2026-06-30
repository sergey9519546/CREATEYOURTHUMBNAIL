export const getRefinementSuggestions = (hook: string, psychology: string): string[] => {
  const suggestions = new Set<string>();

  // Hook-based rules
  if (hook.toLowerCase().includes('curiosity')) {
    suggestions.add("Make the hidden element more ambiguous");
    suggestions.add("Add a subtle red arrow pointing to the mystery");
  }
  if (hook.toLowerCase().includes('comparison') || hook.toLowerCase().includes('vs')) {
    suggestions.add("Add a strong dividing line down the middle");
    suggestions.add("Ensure the 'After' or 'Winner' is 20% brighter");
  }
  if (hook.toLowerCase().includes('storytelling')) {
    suggestions.add("Show the climax of the story, not the beginning");
  }
  if (hook.toLowerCase().includes('listicle')) {
    suggestions.add("Show exactly one item from the list, heavily zoomed in");
  }

  // Psychology-based rules
  if (psychology.toLowerCase().includes('shock') || psychology.toLowerCase().includes('surprise')) {
    suggestions.add("Exaggerate the facial expression by 20%");
    suggestions.add("Increase contrast on the main subject");
  }
  if (psychology.toLowerCase().includes('fear') || psychology.toLowerCase().includes('danger')) {
    suggestions.add("Use darker background tones (vignette)");
    suggestions.add("Make the threat loom over the subject");
  }
  if (psychology.toLowerCase().includes('joy') || psychology.toLowerCase().includes('reward')) {
    suggestions.add("Increase saturation of warm colors (yellow/orange)");
    suggestions.add("Ensure eye contact from the subject is direct");
  }
  if (psychology.toLowerCase().includes('controversy')) {
    suggestions.add("Use high contrast text (Red/White)");
    suggestions.add("Show opposing elements on opposite sides");
  }

  // Fallbacks if not enough specific rules hit
  if (suggestions.size < 2) {
    suggestions.add("Reduce text to maximum 3 words");
    suggestions.add("Make the subject's eyes more prominent");
    suggestions.add("Use a more vibrant, high-contrast color palette");
    suggestions.add("Ensure the foreground pops out from the background");
  }

  return Array.from(suggestions).slice(0, 6);
};
