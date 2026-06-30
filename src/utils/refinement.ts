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
  } else if (p.includes('trust') && h.includes('expert')) {
    suggestions.add("Ensure the subject is making direct eye contact");
    suggestions.add("Add a subtle glow around the subject");
    suggestions.add("Use a clean, white background for a professional look");
    suggestions.add("Include a recognizable logo or badge of authority");
  } else if (p.includes('shock') && h.includes('reaction')) {
    suggestions.add("Exaggerate the facial expression");
    suggestions.add("Use high-contrast, saturated colors (e.g., yellow and red)");
    suggestions.add("Add action lines or motion blur around the subject");
    suggestions.add("Make the text extremely large and bold");
  }

  // Fallbacks
  suggestions.add("Change the background color to create more contrast");
  suggestions.add("Increase the size of the main subject by 20%");
  suggestions.add("Use a more aggressive, bold font for the text");
  suggestions.add("Add a subtle vignette to focus the eye on the center");
  suggestions.add("Try a different layout (e.g., split screen vs centered)");

  // Return exactly 3 random suggestions
  const arr = Array.from(suggestions);
  return arr.sort(() => 0.5 - Math.random()).slice(0, 3);
};
