import { test } from 'node:test';
import * as assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions - fallback', () => {
  const suggestions = getRefinementSuggestions('something', 'else');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
