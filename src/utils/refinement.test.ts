import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions', async (t) => {
  await t.test('returns default suggestions when no match', () => {
    const suggestions = getRefinementSuggestions('basic hook', 'basic psychology');
    assert.strictEqual(suggestions.length, 5);
    assert.ok(suggestions.includes("Increase text size for mobile readability"));
  });

  await t.test('returns suggestions for curiosity and number', () => {
    const suggestions = getRefinementSuggestions('number 5', 'curiosity gap');
    assert.ok(suggestions.includes("Make the number glow to increase focus"));
    assert.ok(suggestions.includes("Add a '?' to the text to drive clicks")); // From secondary block
  });

  await t.test('caps suggestions at 6 items', () => {
    // A combo that triggers many suggestions
    const suggestions = getRefinementSuggestions('comparison versus number listicle storytelling', 'fear curiosity joy controversy excitement');
    assert.strictEqual(suggestions.length, 6);
  });
});
