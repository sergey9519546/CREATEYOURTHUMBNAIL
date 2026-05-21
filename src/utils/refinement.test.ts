import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions handles curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.strictEqual(suggestions.includes("Make the number glow to increase focus"), true);
  assert.strictEqual(suggestions.includes("Use a '?' instead of a digit to amplify mystery"), true);
  assert.strictEqual(suggestions.length <= 6, true);
});

test('getRefinementSuggestions handles fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.strictEqual(suggestions.includes("Make the 'bad' side darker to increase contrast"), true);
  assert.strictEqual(suggestions.includes("Add a warning sign to the 'bad' side"), true);
  assert.strictEqual(suggestions.length <= 6, true);
});

test('getRefinementSuggestions handles joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.strictEqual(suggestions.includes("Add a bright, happy background"), true);
  assert.strictEqual(suggestions.includes("Make the subject's expression more ecstatic"), true);
  assert.strictEqual(suggestions.length <= 6, true);
});

test('getRefinementSuggestions handles empty or unknown inputs', () => {
  const suggestions = getRefinementSuggestions('unknown', 'unknown');
  assert.strictEqual(suggestions.includes("Increase text size for mobile readability"), true);
  assert.strictEqual(suggestions.includes("Boost subject brightness by 20%"), true);
  assert.strictEqual(suggestions.length, 5);
});

test('getRefinementSuggestions returns max 6 items', () => {
  // Trigger many rules
  const suggestions = getRefinementSuggestions('comparison storytelling', 'curiosity fear joy');
  assert.strictEqual(suggestions.length, 6);
});
