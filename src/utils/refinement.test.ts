import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions returns default suggestions when no match', () => {
  const suggestions = getRefinementSuggestions('normal hook', 'normal psychology');
  assert.strictEqual(suggestions.length, 5);
  assert.strictEqual(suggestions[0], 'Increase text size for mobile readability');
});

test('getRefinementSuggestions returns specific suggestions for curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number 10', 'curiosity');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});
