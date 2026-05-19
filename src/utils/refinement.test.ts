import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number 5 will shock you', 'curiosity and intrigue');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
  assert.strictEqual(suggestions.length, 6);
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison: good vs bad', 'fear of missing out');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a red border for urgency"));
  assert.strictEqual(suggestions.length, 6);
});

test('getRefinementSuggestions - joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling about a happy day', 'joy and happiness');
  assert.ok(suggestions.includes("Add a bright, happy background"));
  assert.ok(suggestions.includes("Increase color saturation to 100%"));
  assert.strictEqual(suggestions.length, 6);
});

test('getRefinementSuggestions - fallback', () => {
  const suggestions = getRefinementSuggestions('generic hook', 'neutral psychology');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
  assert.strictEqual(suggestions.length, 5);
});
