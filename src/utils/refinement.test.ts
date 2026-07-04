import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions', async (t) => {
  await t.test('returns default suggestions when no match', () => {
    const suggestions = getRefinementSuggestions('unknown', 'unknown');
    assert.strictEqual(suggestions.length, 5);
    assert.ok(suggestions.includes('Increase text size for mobile readability'));
  });

  await t.test('returns specific suggestions for curiosity and number', () => {
    const suggestions = getRefinementSuggestions('Use a number', 'Curiosity gap');
    assert.ok(suggestions.includes('Make the number glow to increase focus'));
    assert.ok(suggestions.includes("Add a '?' to the text to drive clicks")); // Also matches curiosity
  });

  await t.test('limits suggestions to 6 items', () => {
    const suggestions = getRefinementSuggestions('comparison number storytelling', 'curiosity fear joy mystery urgency excitement');
    assert.strictEqual(suggestions.length, 6);
  });
});
