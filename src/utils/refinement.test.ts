import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('Number 1', 'Curiosity');
  assert.ok(suggestions.some(s => s.includes('glow')));
});

test('getRefinementSuggestions - default', () => {
  const suggestions = getRefinementSuggestions('unknown', 'unknown');
  assert.ok(suggestions.some(s => s.includes('mobile readability')));
});
