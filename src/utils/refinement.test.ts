import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('10 ways to win number', 'Curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('before vs after comparison', 'Fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions - fallback suggestions when no matches', () => {
  const suggestions = getRefinementSuggestions('random hook', 'random psychology');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions - returns a maximum of 6 suggestions', () => {
  const suggestions = getRefinementSuggestions('number comparison story versus listicle narrative', 'curiosity fear joy excitement controversy');
  assert.ok(suggestions.length <= 6);
});
