import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
});

test('getRefinementSuggestions - joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(suggestions.includes("Add a bright, happy background"));
  assert.ok(suggestions.includes("Make the subject's expression more ecstatic"));
});

test('getRefinementSuggestions - curiosity only fallback', () => {
  const suggestions = getRefinementSuggestions('unknown', 'curiosity');
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
  assert.ok(suggestions.includes("Blur the background more to push the subject forward"));
});

test('getRefinementSuggestions - fallback when no match', () => {
  const suggestions = getRefinementSuggestions('random', 'random');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
});

test('getRefinementSuggestions - limits to 6 suggestions', () => {
  const suggestions = getRefinementSuggestions('number comparison storytelling', 'curiosity fear joy');
  assert.strictEqual(suggestions.length, 6);
});

test('getRefinementSuggestions - handles uppercase inputs', () => {
  const suggestions = getRefinementSuggestions('NUMBER', 'CURIOSITY');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});
