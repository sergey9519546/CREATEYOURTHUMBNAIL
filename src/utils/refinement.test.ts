import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('curiosity and number', () => {
  const suggestions = getRefinementSuggestions('Use a number', 'Creates curiosity');
  // It matches the 'curiosity and number' block + 'curiosity or mystery' block
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('fear and comparison', () => {
  const suggestions = getRefinementSuggestions('Comparison', 'Fear');
  // It matches the 'fear and comparison' block + 'fear or urgency' block + 'comparison or versus' block
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('Storytelling', 'Joy');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Add a bright, happy background"));
});

test('default fallback', () => {
  const suggestions = getRefinementSuggestions('nothing specific', 'neutral');
  // Since other suggestions might be added, we just check if length > 0
  // and includes one of the default suggestions.
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
