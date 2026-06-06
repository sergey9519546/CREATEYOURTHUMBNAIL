import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions returns default suggestions', () => {
  const suggestions = getRefinementSuggestions('', '');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions[0].includes('Increase text size'));
});

test('getRefinementSuggestions handles curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.some(s => s.includes('Make the number glow')));
});
