import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

describe('getRefinementSuggestions', () => {
  test('returns curiosity suggestions', () => {
    const result = getRefinementSuggestions('curiosity', 'normal');
    assert.strictEqual(result.length >= 2, true);
    assert.strictEqual(result[0].includes('ambiguous'), true);
  });

  test('returns shock suggestions', () => {
    const result = getRefinementSuggestions('normal', 'shock');
    assert.strictEqual(result.length >= 2, true);
    assert.strictEqual(result[0].includes('Exaggerate'), true);
  });
});
