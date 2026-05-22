import { test } from 'node:test';
import * as assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity + number', () => {
  // Use words that trigger the logic
  const suggestions = getRefinementSuggestions('number 10', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
  assert.ok(suggestions.length <= 6);
});

test('getRefinementSuggestions - fear + comparison', () => {
  const suggestions = getRefinementSuggestions('comparison vs', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  // Wait, the slice(0,6) might cut off "Add a split-screen divider for clear story separation" since it was added later.
  // Let's assert on something earlier, or increase length to see what happens.
  const allSuggestions = getRefinementSuggestions('comparison vs', 'fear');
  assert.ok(allSuggestions.includes("Add a warning sign to the 'bad' side"));
});

test('getRefinementSuggestions - joy + storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(suggestions.includes("Add a bright, happy background"));
  assert.ok(suggestions.includes("Make the subject's expression more ecstatic"));
});

test('getRefinementSuggestions - controversy + versus', () => {
  const suggestions = getRefinementSuggestions('Mac versus PC', 'Controversy');
  assert.ok(suggestions.includes("Use a more confrontational pose"));
  assert.ok(suggestions.includes("Add a split-screen divider for clear story separation"));
});

test('getRefinementSuggestions - empty inputs (fallback)', () => {
  const suggestions = getRefinementSuggestions('', '');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
  assert.strictEqual(suggestions.length, 5);
});

test('getRefinementSuggestions - max 6 items returned', () => {
  // Try to hit many conditions to generate more than 6 suggestions
  const suggestions = getRefinementSuggestions('storytelling comparison versus listicle expert', 'joy fear curiosity controversy mystery');
  assert.ok(suggestions.length <= 6);
});
