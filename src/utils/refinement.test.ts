import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity + number', () => {
  const suggestions = getRefinementSuggestions('10 ways to win (number)', 'Curiosity Gap');
  assert.strictEqual(suggestions.includes("Make the number glow to increase focus"), true);
  assert.strictEqual(suggestions.includes("Use a '?' instead of a digit to amplify mystery"), true);
});

test('getRefinementSuggestions - fear + comparison', () => {
  const suggestions = getRefinementSuggestions('iPhone vs Android (comparison)', 'Fear of Missing Out');
  assert.strictEqual(suggestions.includes("Make the 'bad' side darker to increase contrast"), true);
  assert.strictEqual(suggestions.includes("Add a warning sign to the 'bad' side"), true);
});

test('getRefinementSuggestions - joy + storytelling', () => {
  const suggestions = getRefinementSuggestions('My Amazing Storytelling', 'Joy and Excitement');
  assert.strictEqual(suggestions.includes("Add a bright, happy background"), true);
  assert.strictEqual(suggestions.includes("Make the subject's expression more ecstatic"), true);
});

test('getRefinementSuggestions - mystery only', () => {
  const suggestions = getRefinementSuggestions('Secret reveal', 'Mystery');
  assert.strictEqual(suggestions.includes("Add a '?' to the text to drive clicks"), true);
  assert.strictEqual(suggestions.includes("Blur the background more to push the subject forward"), true);
});

test('getRefinementSuggestions - urgency only', () => {
  const suggestions = getRefinementSuggestions('Do this now', 'Urgency');
  assert.strictEqual(suggestions.includes("Add a red border for urgency"), true);
  assert.strictEqual(suggestions.includes("Make the text bolder and more aggressive"), true);
});

test('getRefinementSuggestions - controversy only', () => {
  const suggestions = getRefinementSuggestions('The truth about diet', 'Controversy');
  assert.strictEqual(suggestions.includes("Use a more confrontational pose"), true);
  assert.strictEqual(suggestions.includes("Add a 'vs' element"), true);
});

test('getRefinementSuggestions - authority only', () => {
  const suggestions = getRefinementSuggestions('Expert guide to fishing', 'Trust');
  assert.strictEqual(suggestions.includes("Add a professional badge or icon"), true);
  assert.strictEqual(suggestions.includes("Make the text cleaner and more authoritative"), true);
});

test('getRefinementSuggestions - listicle only', () => {
  const suggestions = getRefinementSuggestions('Top 5 listicle tools', 'Efficiency');
  assert.strictEqual(suggestions.includes("Add a number badge for scannability"), true);
  assert.strictEqual(suggestions.includes("Use a grid layout for items"), true);
});

test('getRefinementSuggestions - fallback logic', () => {
  const suggestions = getRefinementSuggestions('Random hook', 'Random psych');
  assert.strictEqual(suggestions.includes("Increase text size for mobile readability"), true);
  assert.strictEqual(suggestions.includes("Boost subject brightness by 20%"), true);
});
