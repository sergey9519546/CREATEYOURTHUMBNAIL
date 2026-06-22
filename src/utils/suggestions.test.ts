import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './suggestions.js';

test('getRefinementSuggestions', async (t) => {
  await t.test('returns specific suggestions for curiosity and number', () => {
    const suggestions = getRefinementSuggestions('number 10 ways', 'curiosity');
    assert.strictEqual(suggestions.length > 0, true);
    assert.strictEqual(suggestions.includes("Make the number glow to increase focus"), true);
  });

  await t.test('returns default suggestions when no match', () => {
    const suggestions = getRefinementSuggestions('regular hook', 'regular psychology');
    assert.strictEqual(suggestions.length, 5);
    assert.strictEqual(suggestions.includes("Increase text size for mobile readability"), true);
  });

  await t.test('caps suggestions to 6 max', () => {
    const suggestions = getRefinementSuggestions('number storytelling versus comparison', 'curiosity fear joy mystery controversy excitement');
    assert.strictEqual(suggestions.length, 6);
  });
});
