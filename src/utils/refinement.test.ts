import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions returns default suggestions if no match', () => {
  const suggestions = getRefinementSuggestions('basic hook', 'basic psych');
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions limits output to 6 items', () => {
  const suggestions = getRefinementSuggestions('A number comparison listicle storytelling', 'curiosity fear joy controversy');
  assert.strictEqual(suggestions.length, 6);
});

test('getRefinementSuggestions includes specific matching rules', () => {
  const suggestions = getRefinementSuggestions('number comparison', 'fear curiosity');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
});
