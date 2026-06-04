import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
  const hook = 'top 10 reasons with number';
  const psychology = 'builds curiosity';
  const suggestions = getRefinementSuggestions(hook, psychology);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions - fear and comparison', () => {
  const hook = 'this vs that comparison';
  const psychology = 'fear of missing out';
  const suggestions = getRefinementSuggestions(hook, psychology);
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions - storytelling and narrative', () => {
  const hook = 'storytelling approach';
  const psychology = 'neutral';
  const suggestions = getRefinementSuggestions(hook, psychology);
  assert.ok(suggestions.includes("Add a narrative element to the background"));
});

test('getRefinementSuggestions - default fallback', () => {
  const hook = 'something random';
  const psychology = 'nothing specific';
  const suggestions = getRefinementSuggestions(hook, psychology);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
