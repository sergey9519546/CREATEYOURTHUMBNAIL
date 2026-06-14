import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('returns default suggestions when no match', () => {
  const suggestions = getRefinementSuggestions('something else', 'neutral');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions[0].includes('Increase text size for mobile readability'));
});

test('handles curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number 5', 'curiosity');
  assert.ok(suggestions.some(s => s.includes('Make the number glow')));
  assert.ok(suggestions.some(s => s.includes("Add a '?' to the text")));
});

test('handles fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.some(s => s.includes("Make the 'bad' side darker")));
  // Because it returns exactly 6 elements and fear + comparison matches > 6 elements in total,
  // we check for an element that we know falls within the first 6
  assert.ok(suggestions.some(s => s.includes("Add a warning sign to the 'bad' side")));
});

test('limits output to 6 items', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.strictEqual(suggestions.length, 6);
});

test('handles empty or undefined inputs', () => {
  const suggestions1 = getRefinementSuggestions('', '');
  assert.strictEqual(suggestions1.length, 5);

  const suggestions2 = getRefinementSuggestions(undefined as any, undefined as any);
  assert.strictEqual(suggestions2.length, 5);
});
