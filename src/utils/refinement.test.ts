import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions logic branches', () => {
  // Test fallback suggestions (no match)
  const noMatch = getRefinementSuggestions('normal', 'normal');
  assert.strictEqual(noMatch.length, 5);
  assert.ok(noMatch.includes('Increase text size for mobile readability'));

  // Test curiosity & number
  const curiosityNumber = getRefinementSuggestions('number 5', 'curiosity');
  assert.ok(curiosityNumber.includes("Make the number glow to increase focus"));

  // Test joy & storytelling
  const joyStory = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(joyStory.includes("Add a bright, happy background"));

  // Test fear & urgency
  const fearUrgency = getRefinementSuggestions('urgency', 'fear');
  assert.ok(fearUrgency.includes("Add a red border for urgency"));

  // Max 6 suggestions cap
  const maxSuggestions = getRefinementSuggestions('number comparison storytelling listicle versus authority', 'curiosity fear joy mystery excitement controversy');
  assert.strictEqual(maxSuggestions.length, 6);
});
