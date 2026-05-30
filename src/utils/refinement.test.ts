import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.strictEqual(suggestions.includes("Make the number glow to increase focus"), true);
  assert.strictEqual(suggestions.includes("Add a '?' to the text to drive clicks"), true);
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.strictEqual(suggestions.includes("Make the 'bad' side darker to increase contrast"), true);
  assert.strictEqual(suggestions.includes("Add a red border for urgency"), true);
});

test('getRefinementSuggestions - fallback suggestions when no specific match', () => {
  const suggestions = getRefinementSuggestions('random_hook', 'random_psychology');
  assert.strictEqual(suggestions.length > 0, true);
  assert.strictEqual(suggestions.includes("Increase text size for mobile readability"), true);
});

test('getRefinementSuggestions - handles case insensitivity', () => {
  const suggestions = getRefinementSuggestions('NUMBER', 'CURIOSITY');
  assert.strictEqual(suggestions.includes("Make the number glow to increase focus"), true);
});

test('getRefinementSuggestions - limits to 6 suggestions', () => {
  // Should trigger multiple conditions
  const suggestions = getRefinementSuggestions('comparison number storytelling listicle', 'fear curiosity joy controversy');
  assert.strictEqual(suggestions.length <= 6, true);
});
