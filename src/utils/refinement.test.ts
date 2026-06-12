import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions', async (t) => {
  await t.test('curiosity and number', () => {
    const suggestions = getRefinementSuggestions('number', 'curiosity');
    assert.ok(suggestions.includes("Make the number glow to increase focus"));
    assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
  });

  await t.test('fear and comparison', () => {
    const suggestions = getRefinementSuggestions('comparison', 'fear');
    assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
    assert.ok(suggestions.includes("Add a red border for urgency"));
    // Since array is sliced to 6, "Add a split-screen divider for clear story separation" might be pushed out
    // Lets assert length and a few other specific ones.
    assert.equal(suggestions.length, 6);
  });

  await t.test('joy and storytelling', () => {
    const suggestions = getRefinementSuggestions('storytelling', 'joy');
    assert.ok(suggestions.includes("Add a bright, happy background"));
    assert.ok(suggestions.includes("Increase color saturation to 100%"));
    assert.ok(suggestions.includes("Add a 'happy' narrative element to the background"));
  });

  await t.test('controversy', () => {
    const suggestions = getRefinementSuggestions('some hook', 'controversy');
    assert.ok(suggestions.includes("Use a more confrontational pose"));
  });

  await t.test('fallback (no match)', () => {
    const suggestions = getRefinementSuggestions('unknown hook', 'unknown psychology');
    assert.ok(suggestions.includes("Increase text size for mobile readability"));
    assert.equal(suggestions.length, 5); // Fallback adds 5 suggestions
  });

  await t.test('returns max 6 suggestions', () => {
    // Joy + Storytelling + comparison will trigger many conditions
    const suggestions = getRefinementSuggestions('storytelling and comparison', 'joy and curiosity');
    assert.ok(suggestions.length <= 6);
  });
});
