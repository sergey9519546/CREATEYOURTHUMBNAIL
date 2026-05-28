import { test } from 'node:test';
import * as assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
});

test('getRefinementSuggestions - joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(suggestions.includes("Add a bright, happy background"));
  assert.ok(suggestions.includes("Increase color saturation to 100%"));
});

test('getRefinementSuggestions - empty state fallbacks', () => {
  const suggestions = getRefinementSuggestions('nothing', 'nothing');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.strictEqual(suggestions.length, 5); // 5 fallbacks
});

test('getRefinementSuggestions - limits to 6 items', () => {
  const suggestions = getRefinementSuggestions('number storytelling comparison', 'curiosity fear joy mystery');
  assert.strictEqual(suggestions.length, 6);
});
