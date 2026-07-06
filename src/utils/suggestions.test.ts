import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './suggestions';

describe('getRefinementSuggestions', () => {
  test('returns default suggestions when no match', () => {
    const suggestions = getRefinementSuggestions('unknown', 'unknown');
    assert.ok(suggestions.length > 0);
    assert.ok(suggestions.includes("Increase text size for mobile readability"));
  });

  test('returns specific suggestions for curiosity and number', () => {
    const suggestions = getRefinementSuggestions('number hook', 'curiosity');
    assert.ok(suggestions.includes("Make the number glow to increase focus"));
  });

  test('returns specific suggestions for comparison and fear', () => {
    const suggestions = getRefinementSuggestions('comparison', 'fear');
    assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  });

  test('returns maximum of 6 suggestions', () => {
    // Both fear and joy triggers
    const suggestions = getRefinementSuggestions('comparison storytelling', 'fear joy curiosity');
    assert.ok(suggestions.length <= 6);
  });
});
