import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('returns default suggestions when no match is found', () => {
  const suggestions = getRefinementSuggestions('random hook', 'random psychology');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('matches curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks")); // from curiosity base
});

test('matches fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
  // Array size is limited to 6, and earlier base elements fill it up first
  assert.ok(suggestions.includes('Add a red border for urgency'));
});

test('matches joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(suggestions.includes("Add a bright, happy background"));
  // Array size is limited to 6, and earlier base elements fill it up first
  assert.ok(suggestions.includes("Add a 'happy' narrative element to the background"));
});

test('limits array size to 6', () => {
  const suggestions = getRefinementSuggestions('number comparison storytelling', 'curiosity fear joy');
  assert.strictEqual(suggestions.length, 6);
});
