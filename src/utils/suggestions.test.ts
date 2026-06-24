import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './suggestions.js';

test('getRefinementSuggestions fallbacks', () => {
  const suggestions = getRefinementSuggestions('', '');
  assert.strictEqual(suggestions.length, 3);
  assert.ok(suggestions.some(s => s.includes('Increase color contrast')));
});

test('getRefinementSuggestions specific rules', () => {
  const curiositySuggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(curiositySuggestions.some(s => s.includes("Make the number glow")));

  const joySuggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(joySuggestions.some(s => s.includes("bright, happy background")));
});
