import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions returns default suggestions if no matches', () => {
  const suggestions = getRefinementSuggestions('normal', 'normal');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions handles curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions handles comparison and fear', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions limits to 6 suggestions', () => {
  // To get more than 6 suggestions, we need multiple blocks to trigger
  const suggestions = getRefinementSuggestions('comparison', 'curiosity');
  assert.strictEqual(suggestions.length, 6); // It will add from comparison and from curiosity
});
