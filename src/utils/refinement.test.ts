import { test } from 'node:test';
import * as assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity + number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.strictEqual(suggestions.includes("Make the number glow to increase focus"), true);
  assert.strictEqual(suggestions.includes("Use a '?' instead of a digit to amplify mystery"), true);
});

test('getRefinementSuggestions - fear + comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.strictEqual(suggestions.includes("Make the 'bad' side darker to increase contrast"), true);
  assert.strictEqual(suggestions.includes("Add a warning sign to the 'bad' side"), true);
});

test('getRefinementSuggestions - joy + storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.strictEqual(suggestions.includes("Add a bright, happy background"), true);
  assert.strictEqual(suggestions.includes("Make the subject's expression more ecstatic"), true);
});

test('getRefinementSuggestions - empty inputs (fallback)', () => {
  const suggestions = getRefinementSuggestions('', '');
  assert.strictEqual(suggestions.includes("Increase text size for mobile readability"), true);
  assert.strictEqual(suggestions.includes("Boost subject brightness by 20%"), true);
});

test('getRefinementSuggestions - mixed inputs', () => {
  const suggestions = getRefinementSuggestions('comparison', 'joy');
  assert.strictEqual(suggestions.includes("Increase color saturation to 100%"), true);
  assert.strictEqual(suggestions.includes("Add a split-screen divider for clear story separation"), true);
});

test('getRefinementSuggestions - listicle', () => {
  const suggestions = getRefinementSuggestions('listicle', 'none');
  assert.strictEqual(suggestions.includes("Add a number badge for scannability"), true);
  assert.strictEqual(suggestions.includes("Use a grid layout for items"), true);
});
