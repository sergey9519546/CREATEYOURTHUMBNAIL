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
    suggestions.add("Add bright, dynamic speed lines to the background");
    suggestions.add("Use a thick, bright outline around the main subject");
  } else if (p.includes('anger') || p.includes('outrage')) {
    suggestions.add("Add a giant red 'X' over the subject");
    suggestions.add("Make the subject look frustrated or angry");
    suggestions.add("Desaturate the background to emphasize the red elements");
    suggestions.add("Use a bold, distressed font for the text");
  }

  if (suggestions.size === 0) {
    suggestions.add("Increase overall contrast and saturation by 15%");
    suggestions.add("Make the main text overlay 20% larger");
    suggestions.add("Add a subtle vignette to focus the eye on the center");
    suggestions.add("Simplify the background to reduce visual clutter");
    suggestions.add("Ensure the subject's eyes are clearly visible and looking near the text");
  }

  return Array.from(suggestions).slice(0, 4); // return up to 4 suggestions
};
