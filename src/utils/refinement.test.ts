import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.strictEqual(suggestions.includes("Make the number glow to increase focus"), true);
});

test('getRefinementSuggestions - default', () => {
  const suggestions = getRefinementSuggestions('foo', 'bar');
  assert.strictEqual(suggestions.includes("Increase text size for mobile readability"), true);
});
