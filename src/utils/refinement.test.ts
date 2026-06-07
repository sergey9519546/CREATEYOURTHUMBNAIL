import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - fallback', () => {
  const suggestions = getRefinementSuggestions('basic', 'neutral');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions[0].includes('Increase text size for mobile readability'));
});

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('top 10 numbers', 'high curiosity');
  assert.ok(suggestions.some(s => s.includes('Make the number glow')));
});
