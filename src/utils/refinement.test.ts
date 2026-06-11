import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number 10 ways', 'curiosity');
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
});

test('getRefinementSuggestions fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison test', 'fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a red border for urgency"));
});

test('getRefinementSuggestions fallback suggestions', () => {
  const suggestions = getRefinementSuggestions('default hook', 'default psychology');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
});

test('getRefinementSuggestions max 6 items', () => {
  const suggestions = getRefinementSuggestions('versus 10 storytelling comparison listicle', 'curiosity fear joy mystery excitement controversy');
  assert.strictEqual(suggestions.length, 6);
});
