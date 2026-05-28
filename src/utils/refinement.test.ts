import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
  const result = getRefinementSuggestions('number 10 ways to win', 'Curiosity gap');
  assert.strictEqual(result.includes("Make the number glow to increase focus"), true);
  assert.strictEqual(result.includes("Use a '?' instead of a digit to amplify mystery"), true);
});

test('getRefinementSuggestions - fear and comparison', () => {
  const result = getRefinementSuggestions('Comparison of tools', 'Fear of missing out');
  assert.strictEqual(result.includes("Make the 'bad' side darker to increase contrast"), true);
  assert.strictEqual(result.includes("Add a warning sign to the 'bad' side"), true);
});

test('getRefinementSuggestions - joy and storytelling', () => {
  const result = getRefinementSuggestions('Storytelling time', 'Joy and excitement');
  assert.strictEqual(result.includes("Add a bright, happy background"), true);
  assert.strictEqual(result.includes("Make the subject's expression more ecstatic"), true);
});

test('getRefinementSuggestions - fallback suggestions', () => {
  const result = getRefinementSuggestions('Random hook', 'Random psychology');
  assert.strictEqual(result.includes("Increase text size for mobile readability"), true);
  assert.strictEqual(result.includes("Boost subject brightness by 20%"), true);
  assert.strictEqual(result.length <= 6, true);
});

test('getRefinementSuggestions - limits to 6 suggestions', () => {
  const result = getRefinementSuggestions('Comparison storytelling', 'Curiosity fear joy');
  assert.strictEqual(result.length <= 6, true);
});
