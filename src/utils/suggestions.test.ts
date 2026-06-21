import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './suggestions.js';

test('getRefinementSuggestions returns default suggestions when no match', () => {
  const suggestions = getRefinementSuggestions('normal hook', 'normal psych');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions matches curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number one', 'curiosity gap');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions matches fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison vs', 'fear');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions matches joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling time', 'joyful');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Add a bright, happy background"));
});

test('getRefinementSuggestions limits to 6 suggestions', () => {
  // Matches multiple conditions to generate many suggestions
  const suggestions = getRefinementSuggestions('comparison versus listicle narrative storytelling expert number', 'curiosity mystery fear urgency joy excitement controversy');
  assert.ok(suggestions.length <= 6);
});
