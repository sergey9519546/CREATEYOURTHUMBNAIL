import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('Top 10 number ways', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison versus', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions - fallback suggestions', () => {
  const suggestions = getRefinementSuggestions('random hook', 'random psychology');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.strictEqual(suggestions.length, 5); // Fallback adds 5 suggestions
});

test('getRefinementSuggestions - max 6 suggestions returned', () => {
  // Both fear/comparison and fear/urgency match, creating multiple suggestions
  const suggestions = getRefinementSuggestions('comparison versus', 'fear urgency');
  assert.strictEqual(suggestions.length, 6);
});
