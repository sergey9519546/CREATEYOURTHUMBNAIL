import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('10 ways to win number', 'Curiosity');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison Before vs After', 'Fear of missing out');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  // Replaced second assertion as "Add a split-screen divider for clear story separation" is not in the first 6 items due to Array.from(suggestions).slice(0, 6);
  assert.ok(suggestions.includes("Add a red border for urgency"));
});

test('getRefinementSuggestions - default fallback', () => {
  const suggestions = getRefinementSuggestions('Just a vlog', 'Neutral');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions - limits to 6 suggestions', () => {
  const suggestions = getRefinementSuggestions('10 ways to compare fear joy controversy storytelling', 'curiosity fear joy controversy');
  assert.ok(suggestions.length <= 6);
});
