import test, { describe } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

describe('getRefinementSuggestions', () => {
  test('returns default suggestions when no conditions match', () => {
    const suggestions = getRefinementSuggestions('normal hook', 'normal psychology');
    assert.ok(suggestions.includes("Increase text size for mobile readability"));
    assert.strictEqual(suggestions.length, 5); // Default size
  });

  test('returns suggestions for curiosity and number combination', () => {
    const suggestions = getRefinementSuggestions('contains number 5', 'creates curiosity');
    assert.ok(suggestions.includes("Make the number glow to increase focus"));
    assert.ok(suggestions.includes("Add a '?' to the text to drive clicks")); // Fallthrough from curiosity
  });

  test('caps returned suggestions to 6 maximum', () => {
    // A combination that hits many conditions
    const suggestions = getRefinementSuggestions('comparison versus number', 'curiosity fear joy');
    assert.strictEqual(suggestions.length, 6);
  });
});
