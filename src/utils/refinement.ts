export const getRefinementSuggestions = (hook: string, psychology: string): string[] => {
  const h = hook.toLowerCase();
  const p = psychology.toLowerCase();
  const suggestions: Set<string> = new Set();

  if (p.includes('curiosity') && h.includes('number')) {
    suggestions.add("Make the number glow to increase focus");
    suggestions.add("Use a '?' instead of a digit to amplify mystery");
    suggestions.add("Partially obscure the number to create a curiosity gap");
    suggestions.add("Use a 3D extruded font for the number for visual weight");
    suggestions.add("Add a 'censored' bar over the number");
  } else if (p.includes('fear') && h.includes('comparison')) {
    suggestions.add("Make the 'bad' side darker to increase contrast");
    suggestions.add("Add a warning sign to the 'bad' side");
    suggestions.add("Use a red tint on the 'bad' side for urgency");
    suggestions.add("Make the 'good' side brighter to enhance the contrast");
  } else if (p.includes('joy') && h.includes('storytelling')) {
    suggestions.add("Add a bright, happy background");
    suggestions.add("Make the subject's expression more ecstatic");
    suggestions.add("Use vibrant, warm colors to boost energy");
    suggestions.add("Add a 'happy' narrative element to the background");
  }

  if (p.includes('curiosity') || p.includes('mystery')) {
    suggestions.add("Add a '?' to the text to drive clicks");
    suggestions.add("Blur the background more to push the subject forward");
    suggestions.add("Make the main subject look surprised");
    suggestions.add("Add a hidden object in the background");
  } else if (p.includes('fear') || p.includes('urgency')) {
    suggestions.add("Add a red border for urgency");
    suggestions.add("Make the text bolder and more aggressive");
    suggestions.add("Add a warning icon");
    suggestions.add("Increase contrast for a starker, more dramatic look");
  } else if (p.includes('joy') || p.includes('excitement')) {
    suggestions.add("Increase color saturation to 100%");
    suggestions.add("Add a smiling face with closed mouth (MrBeast strategy)");
    suggestions.add("Make the lighting brighter and more positive");
    suggestions.add("Add confetti or sparkles for energy");
  } else if (p.includes('controversy')) {
    suggestions.add("Use a more confrontational pose");
    suggestions.add("Add a 'vs' element");
    suggestions.add("Use high-contrast, aggressive typography");
  }

  if (h.includes('comparison') || h.includes('versus')) {
    suggestions.add("Add a split-screen divider for clear story separation");
    suggestions.add("Enhance the 'after' contrast");
    suggestions.add("Make the 'before' desaturated");
    suggestions.add("Use a 'before' and 'after' label");
  } else if (h.includes('storytelling') || h.includes('narrative')) {
    suggestions.add("Add a narrative element to the background");
    suggestions.add("Make the subject look more expressive");
    suggestions.add("Adjust lighting to focus on the subject");
    suggestions.add("Add a background element that tells a story");
  } else if (h.includes('authority') || h.includes('expert')) {
    suggestions.add("Add a professional badge or icon");
    suggestions.add("Make the text cleaner and more authoritative");
    suggestions.add("Adjust lighting for a studio look");
    suggestions.add("Use a more formal, clean background");
  } else if (h.includes('listicle')) {
    suggestions.add("Add a number badge for scannability");
    suggestions.add("Use a grid layout for items");
    suggestions.add("Make the text more scannable and bold");
  }

  if (suggestions.size === 0) {
    suggestions.add("Increase text size for mobile readability");
    suggestions.add("Boost subject brightness by 20%");
    suggestions.add("Simplify the background to reduce noise");
    suggestions.add("Add more detail to the primary subject");
    suggestions.add("Use a more vibrant, high-contrast color palette");
  }

  return Array.from(suggestions).slice(0, 6);
};