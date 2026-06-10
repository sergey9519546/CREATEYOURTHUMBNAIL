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
    suggestions.add("Use bright, warm colors (yellows, oranges, bright greens)");
    suggestions.add("Add energetic motion blur to background elements");
  } else if (p.includes('trust') || p.includes('authority')) {
    suggestions.add("Use a cooler color palette (blues, teals)");
    suggestions.add("Make the subject's posture more upright and confident");
    suggestions.add("Use a clean, modern font for the text");
    suggestions.add("Add a subtle glow behind the main subject");
  } else if (p.includes('sadness') || p.includes('empathy')) {
    suggestions.add("Decrease color saturation slightly");
    suggestions.add("Use a cooler, more muted color palette");
    suggestions.add("Make the subject's expression more somber");
    suggestions.add("Add a vignette effect to draw focus to the subject's face");
  }

  if (h.includes('question') || h.includes('how to')) {
    suggestions.add("Add a pointing arrow to guide the viewer's eye");
    suggestions.add("Use a split screen to show 'before' and 'after'");
    suggestions.add("Include a visual representation of the problem being solved");
  } else if (h.includes('list') || h.includes('top')) {
    suggestions.add("Add a bold, oversized number representing the list size");
    suggestions.add("Show a collage of the items in the list");
    suggestions.add("Use a grid layout for a structured look");
  } else if (h.includes('secret') || h.includes('hack')) {
    suggestions.add("Use a 'magnifying glass' effect on a specific detail");
    suggestions.add("Add a 'top secret' stamp or watermark");
    suggestions.add("Use high contrast to make the 'secret' element pop");
  }

  if (suggestions.size === 0) {
    suggestions.add("Increase overall contrast to make the thumbnail pop");
    suggestions.add("Make the text larger and easier to read on mobile");
    suggestions.add("Ensure the main subject is clearly visible and in focus");
  }

  return Array.from(suggestions).slice(0, 4);
};
