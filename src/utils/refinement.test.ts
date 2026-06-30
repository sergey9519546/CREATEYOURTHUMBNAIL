import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

describe('getRefinementSuggestions', () => {
  test('returns 3 suggestions', () => {
    const suggestions = getRefinementSuggestions('number', 'curiosity');
    assert.strictEqual(suggestions.length, 3);
  });
  test('returns fallbacks when no match', () => {
    const suggestions = getRefinementSuggestions('none', 'none');
    assert.strictEqual(suggestions.length, 3);
  });
});
