import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './suggestions.js';

test('getRefinementSuggestions', async (t) => {
  await t.test('returns curiosity and number suggestions', () => {
    const suggestions = getRefinementSuggestions('number of things', 'curiosity');
    assert.ok(suggestions.includes("Make the number glow to increase focus"));
    assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
  });

  await t.test('returns fear and comparison suggestions', () => {
    const suggestions = getRefinementSuggestions('comparison of things', 'fear');
    assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
    assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
  });

  await t.test('returns joy and storytelling suggestions', () => {
    const suggestions = getRefinementSuggestions('storytelling of things', 'joy');
    assert.ok(suggestions.includes("Add a bright, happy background"));
    assert.ok(suggestions.includes("Make the subject's expression more ecstatic"));
  });

  await t.test('returns default suggestions when no match', () => {
    const suggestions = getRefinementSuggestions('general hook', 'general psychology');
    assert.ok(suggestions.includes("Increase text size for mobile readability"));
    assert.ok(suggestions.includes("Boost subject brightness by 20%"));
  });

  await t.test('limits suggestions to 6 items', () => {
    // Both fear and comparison trigger multiple overlapping branches
    const suggestions = getRefinementSuggestions('comparison versus narrative', 'fear controversy');
    assert.ok(suggestions.length <= 6);
  });
});
