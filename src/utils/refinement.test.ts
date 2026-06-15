import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity + number', () => {
  const suggestions = getRefinementSuggestions('Number hook', 'Curiosity');
  assert.ok(suggestions.some(s => s.includes('Make the number glow')));
});

test('getRefinementSuggestions - fear + comparison', () => {
  const suggestions = getRefinementSuggestions('Comparison', 'Fear');
  assert.ok(suggestions.some(s => s.includes('warning sign')));
  assert.ok(suggestions.some(s => s.includes('red border for urgency')));
});

test('getRefinementSuggestions - fallback', () => {
  const suggestions = getRefinementSuggestions('random', 'random');
  assert.ok(suggestions.some(s => s.includes('Boost subject brightness')));
  assert.ok(suggestions.length <= 6);
});
