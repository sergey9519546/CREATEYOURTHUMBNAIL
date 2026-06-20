import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './suggestions.js';

test('getRefinementSuggestions returns default suggestions if no match', () => {
  const suggestions = getRefinementSuggestions('basic', 'normal');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions matches curiosity and mystery', () => {
  const suggestions = getRefinementSuggestions('basic hook', 'curiosity');
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
  // Max 6 suggestions
  assert.ok(suggestions.length <= 6);
});

test('getRefinementSuggestions matches fear and comparison', () => {
  const suggestions = getRefinementSuggestions('a comparison between two things', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  // Because 'fear' logic also triggers the 'urgency/fear' block, the set grows, and we take slice(0,6)
  // The split-screen logic ('comparison') is triggered later in the file, and might get cut off by slice.
  // So instead we just check that the set length is exactly 6 and contains one of the first suggestions.
  assert.strictEqual(suggestions.length, 6);
  assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
});
