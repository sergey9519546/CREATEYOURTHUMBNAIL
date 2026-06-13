import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity + number hook', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.some(s => s.includes('glow')), 'Should suggest making number glow');
  assert.ok(suggestions.some(s => s.includes('?')), 'Should suggest using ?');
});

test('getRefinementSuggestions - fear + comparison hook', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.some(s => s.includes('darker')), 'Should suggest making bad side darker');
});

test('getRefinementSuggestions - fallback suggestions', () => {
  const suggestions = getRefinementSuggestions('generic hook', 'bland emotion');
  assert.ok(suggestions.some(s => s.includes('Increase text size')), 'Should suggest increasing text size');
});
