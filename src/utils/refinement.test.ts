import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - Returns fallback suggestions when no matches', () => {
  const suggestions = getRefinementSuggestions('basic hook', 'neutral psychology');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions - Matches curiosity and number combination', () => {
  const suggestions = getRefinementSuggestions('Top 10 ways', 'Curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks")); // Fallthrough check
});

test('getRefinementSuggestions - Matches joy and storytelling combination', () => {
  const suggestions = getRefinementSuggestions('Storytelling time', 'Joyful');
  assert.ok(suggestions.includes("Add a bright, happy background"));
});

test('getRefinementSuggestions - Caps suggestions at max 6', () => {
  // Should trigger fear+comparison, fear fallthrough, and comparison fallthrough
  const suggestions = getRefinementSuggestions('Comparison of doom', 'Fearful');
  assert.strictEqual(suggestions.length, 6);
});
