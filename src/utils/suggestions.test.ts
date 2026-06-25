import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './suggestions.js';

test('getRefinementSuggestions returns correct suggestions', () => {
  // Test fallback suggestions (when no specific triggers match)
  const defaultSuggestions = getRefinementSuggestions('normal hook', 'normal psychology');
  assert.ok(defaultSuggestions.includes('Increase text size for mobile readability'));
  assert.strictEqual(defaultSuggestions.length, 5); // Fallback adds 5 suggestions

  // Test curiosity and number combination
  const curiosityNumberSuggestions = getRefinementSuggestions('A hook with a number', 'Curiosity');
  assert.ok(curiosityNumberSuggestions.includes('Make the number glow to increase focus'));

  // Test fear and comparison combination
  const fearComparisonSuggestions = getRefinementSuggestions('A versus comparison', 'Fear and urgency');
  assert.ok(fearComparisonSuggestions.includes("Make the 'bad' side darker to increase contrast"));

  // Ensure it caps at 6 items as per logic
  const broadSuggestions = getRefinementSuggestions('number versus storytelling listicle', 'curiosity fear joy excitement controversy');
  assert.strictEqual(broadSuggestions.length, 6);
});
