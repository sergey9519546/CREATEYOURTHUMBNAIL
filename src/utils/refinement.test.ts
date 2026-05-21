import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number 10 ways', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions fallback when no matches', () => {
  const suggestions = getRefinementSuggestions('random', 'nothing');
  assert.strictEqual(suggestions.length, 5); // Fallback adds 5 suggestions, slice takes max 6
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
});

test('getRefinementSuggestions maximum limit', () => {
  // Joy + storytelling + excitement gives many suggestions
  const suggestions = getRefinementSuggestions('storytelling', 'joy and excitement');
  assert.ok(suggestions.length <= 6);
});
