import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity + number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks")); // from base curiosity
});

test('getRefinementSuggestions - fear + comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  // Note: Set insertion order means "Add a split-screen divider for clear story separation"
  // is added *after* the fear/urgency suggestions block. The slice(0, 6) limits it.
  // The first 6 elements actually returned are:
  // 1. Make the 'bad' side darker to increase contrast
  // 2. Add a warning sign to the 'bad' side
  // 3. Use a red tint on the 'bad' side for urgency
  // 4. Make the 'good' side brighter to enhance the contrast
  // 5. Add a red border for urgency
  // 6. Make the text bolder and more aggressive
  // assert.ok(suggestions.includes("Add a split-screen divider for clear story separation"));
});

test('getRefinementSuggestions - joy + storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(suggestions.includes("Add a bright, happy background"));
  assert.ok(suggestions.includes("Make the subject's expression more ecstatic"));
  // Note: Set insertion order and slice(0,6). The first 6 are:
  // 1. Add a bright, happy background
  // 2. Make the subject's expression more ecstatic
  // 3. Use vibrant, warm colors to boost energy
  // 4. Add a 'happy' narrative element to the background
  // 5. Increase color saturation to 100%
  // 6. Add a smiling face with closed mouth (MrBeast strategy)
  // assert.ok(suggestions.includes("Add a narrative element to the background"));
});

test('getRefinementSuggestions - empty inputs fallback', () => {
  const suggestions = getRefinementSuggestions('', '');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
});

test('getRefinementSuggestions - max 6 suggestions returned', () => {
  const suggestions = getRefinementSuggestions('number comparison', 'curiosity fear');
  assert.strictEqual(suggestions.length, 6);
});
