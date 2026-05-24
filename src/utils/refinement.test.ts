import { test } from 'node:test';
import * as assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity + number hook', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions - fear + comparison hook', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions - joy + storytelling hook', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Add a bright, happy background"));
});

test('getRefinementSuggestions - curiosity/mystery only', () => {
  const suggestions = getRefinementSuggestions('generic', 'mystery');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
});

test('getRefinementSuggestions - fallback', () => {
  const suggestions = getRefinementSuggestions('generic', 'generic');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
