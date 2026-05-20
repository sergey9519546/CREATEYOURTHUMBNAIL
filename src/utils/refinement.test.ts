import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - Curiosity and Number', () => {
  const suggestions = getRefinementSuggestions('Number', 'Curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
  assert.ok(suggestions.includes("Partially obscure the number to create a curiosity gap"));
  assert.ok(suggestions.includes("Use a 3D extruded font for the number for visual weight"));
  assert.ok(suggestions.includes("Add a 'censored' bar over the number"));
});

test('getRefinementSuggestions - Fear and Comparison', () => {
  const suggestions = getRefinementSuggestions('Comparison', 'Fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
  assert.ok(suggestions.includes("Use a red tint on the 'bad' side for urgency"));
  assert.ok(suggestions.includes("Make the 'good' side brighter to enhance the contrast"));
});

test('getRefinementSuggestions - Joy and Storytelling', () => {
  const suggestions = getRefinementSuggestions('Storytelling', 'Joy');
  assert.ok(suggestions.includes("Add a bright, happy background"));
  assert.ok(suggestions.includes("Make the subject's expression more ecstatic"));
  assert.ok(suggestions.includes("Use vibrant, warm colors to boost energy"));
  assert.ok(suggestions.includes("Add a 'happy' narrative element to the background"));
});

test('getRefinementSuggestions - Mystery (Curiosity subset)', () => {
  const suggestions = getRefinementSuggestions('General', 'Mystery');
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
  assert.ok(suggestions.includes("Blur the background more to push the subject forward"));
  assert.ok(suggestions.includes("Make the main subject look surprised"));
  assert.ok(suggestions.includes("Add a hidden object in the background"));
});

test('getRefinementSuggestions - Urgency (Fear subset)', () => {
  const suggestions = getRefinementSuggestions('General', 'Urgency');
  assert.ok(suggestions.includes("Add a red border for urgency"));
  assert.ok(suggestions.includes("Make the text bolder and more aggressive"));
  assert.ok(suggestions.includes("Add a warning icon"));
  assert.ok(suggestions.includes("Increase contrast for a starker, more dramatic look"));
});

test('getRefinementSuggestions - Excitement (Joy subset)', () => {
  const suggestions = getRefinementSuggestions('General', 'Excitement');
  assert.ok(suggestions.includes("Increase color saturation to 100%"));
  assert.ok(suggestions.includes("Add a smiling face with closed mouth (MrBeast strategy)"));
  assert.ok(suggestions.includes("Make the lighting brighter and more positive"));
  assert.ok(suggestions.includes("Add confetti or sparkles for energy"));
});

test('getRefinementSuggestions - Controversy', () => {
  const suggestions = getRefinementSuggestions('General', 'Controversy');
  assert.ok(suggestions.includes("Use a more confrontational pose"));
  assert.ok(suggestions.includes("Add a 'vs' element"));
  assert.ok(suggestions.includes("Use high-contrast, aggressive typography"));
});

test('getRefinementSuggestions - Versus (Comparison subset)', () => {
  const suggestions = getRefinementSuggestions('Versus', 'General');
  assert.ok(suggestions.includes("Add a split-screen divider for clear story separation"));
  assert.ok(suggestions.includes("Enhance the 'after' contrast"));
  assert.ok(suggestions.includes("Make the 'before' desaturated"));
  assert.ok(suggestions.includes("Use a 'before' and 'after' label"));
});

test('getRefinementSuggestions - Narrative (Storytelling subset)', () => {
  const suggestions = getRefinementSuggestions('Narrative', 'General');
  assert.ok(suggestions.includes("Add a narrative element to the background"));
  assert.ok(suggestions.includes("Make the subject look more expressive"));
  assert.ok(suggestions.includes("Adjust lighting to focus on the subject"));
  assert.ok(suggestions.includes("Add a background element that tells a story"));
});

test('getRefinementSuggestions - Expert (Authority subset)', () => {
  const suggestions = getRefinementSuggestions('Expert', 'General');
  assert.ok(suggestions.includes("Add a professional badge or icon"));
  assert.ok(suggestions.includes("Make the text cleaner and more authoritative"));
  assert.ok(suggestions.includes("Adjust lighting for a studio look"));
  assert.ok(suggestions.includes("Use a more formal, clean background"));
});

test('getRefinementSuggestions - Listicle', () => {
  const suggestions = getRefinementSuggestions('Listicle', 'General');
  assert.ok(suggestions.includes("Add a number badge for scannability"));
  assert.ok(suggestions.includes("Use a grid layout for items"));
  assert.ok(suggestions.includes("Make the text more scannable and bold"));
});

test('getRefinementSuggestions - Fallback suggestions when size is 0', () => {
  const suggestions = getRefinementSuggestions('Unknown', 'Unknown');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
  assert.ok(suggestions.includes("Simplify the background to reduce noise"));
  assert.ok(suggestions.includes("Add more detail to the primary subject"));
  assert.ok(suggestions.includes("Use a more vibrant, high-contrast color palette"));
});

test('getRefinementSuggestions - Returns at most 6 items', () => {
  const suggestions = getRefinementSuggestions('Number', 'Curiosity');
  assert.ok(suggestions.length <= 6);
});
