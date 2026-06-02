import { test } from 'node:test';
import * as assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - returns default suggestions when no match', () => {
  const suggestions = getRefinementSuggestions('', '');
  assert.strictEqual(suggestions.length, 5);
  assert.strictEqual(suggestions[0], "Increase text size for mobile readability");
});
