import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - exact matches (curiosity + number)', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.strictEqual(suggestions.includes("Make the number glow to increase focus"), true);
  assert.strictEqual(suggestions.includes("Use a '?' instead of a digit to amplify mystery"), true);
});

test('getRefinementSuggestions - exact matches (fear + comparison)', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.strictEqual(suggestions.includes("Make the 'bad' side darker to increase contrast"), true);
  assert.strictEqual(suggestions.includes("Add a warning sign to the 'bad' side"), true);
});

test('getRefinementSuggestions - exact matches (joy + storytelling)', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.strictEqual(suggestions.includes("Add a bright, happy background"), true);
  assert.strictEqual(suggestions.includes("Make the subject's expression more ecstatic"), true);
});

test('getRefinementSuggestions - partial matches (only curiosity/mystery)', () => {
  const suggestions = getRefinementSuggestions('', 'mystery');
  assert.strictEqual(suggestions.includes("Add a '?' to the text to drive clicks"), true);
});

test('getRefinementSuggestions - partial matches (only fear/urgency)', () => {
  const suggestions = getRefinementSuggestions('', 'urgency');
  assert.strictEqual(suggestions.includes("Add a red border for urgency"), true);
});

test('getRefinementSuggestions - partial matches (only comparison/versus)', () => {
  const suggestions = getRefinementSuggestions('versus', '');
  assert.strictEqual(suggestions.includes("Add a split-screen divider for clear story separation"), true);
});

test('getRefinementSuggestions - edge case (empty strings)', () => {
  const suggestions = getRefinementSuggestions('', '');
  assert.strictEqual(suggestions.includes("Increase text size for mobile readability"), true);
  assert.strictEqual(suggestions.includes("Boost subject brightness by 20%"), true);
});

test('getRefinementSuggestions - length constraint', () => {
  // Pass strings that will trigger multiple conditions to generate more than 6 suggestions
  const suggestions = getRefinementSuggestions('number comparison storytelling', 'curiosity fear joy');
  assert.strictEqual(suggestions.length <= 6, true);
});
