import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions adds specific suggestions for curiosity + number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions adds fallback suggestions if nothing matches', () => {
  const suggestions = getRefinementSuggestions('normal', 'normal');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
