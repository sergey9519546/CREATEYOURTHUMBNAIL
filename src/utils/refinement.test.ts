import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions handles curiosity and number', () => {
  const suggestions = getRefinementSuggestions('Number', 'Curiosity');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});
