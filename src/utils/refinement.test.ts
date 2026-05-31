import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.ts';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions - default fallback', () => {
  const suggestions = getRefinementSuggestions('unknown', 'unknown');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
