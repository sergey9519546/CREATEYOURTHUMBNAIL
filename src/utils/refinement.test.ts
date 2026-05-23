import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

describe('getRefinementSuggestions', () => {
  test('returns default suggestions when hook and psychology are empty', () => {
    const suggestions = getRefinementSuggestions('', '');
    assert.strictEqual(suggestions.length, 5);
    assert.ok(suggestions.includes("Increase text size for mobile readability"));
  });

  test('returns curiosity and number suggestions', () => {
    const suggestions = getRefinementSuggestions('10 ways number', 'curiosity');
    assert.ok(suggestions.includes("Make the number glow to increase focus"));
    assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
    // Default fallback size should ensure max 6
    assert.ok(suggestions.length <= 6);
  });

  test('returns fear and comparison suggestions', () => {
    const suggestions = getRefinementSuggestions('versus comparison', 'fear');
    assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
    assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
  });

  test('returns joy and storytelling suggestions', () => {
    const suggestions = getRefinementSuggestions('storytelling', 'joy');
    assert.ok(suggestions.includes("Add a bright, happy background"));
    assert.ok(suggestions.includes("Add a 'happy' narrative element to the background"));
  });

  test('returns controversy suggestions', () => {
    const suggestions = getRefinementSuggestions('', 'controversy');
    assert.ok(suggestions.includes("Use a more confrontational pose"));
  });

  test('returns authority suggestions', () => {
    const suggestions = getRefinementSuggestions('expert advice', '');
    assert.ok(suggestions.includes("Add a professional badge or icon"));
  });

  test('returns listicle suggestions', () => {
    const suggestions = getRefinementSuggestions('top listicle items', '');
    assert.ok(suggestions.includes("Add a number badge for scannability"));
  });

  test('returns maximum 6 suggestions', () => {
     // A combination that might trigger many hits
    const suggestions = getRefinementSuggestions('comparison versus number storytelling expert', 'curiosity fear joy controversy');
    assert.strictEqual(suggestions.length, 6);
  });
});
