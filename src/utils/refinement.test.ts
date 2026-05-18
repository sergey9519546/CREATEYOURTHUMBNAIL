import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('returns default suggestions when hook and psychology are empty', () => {
  const result = getRefinementSuggestions('', '');
  assert.strictEqual(result.length, 5);
  assert.ok(result.includes("Increase text size for mobile readability"));
});

test('returns curiosity and number specific suggestions', () => {
  const result = getRefinementSuggestions('number', 'curiosity');
  assert.ok(result.length > 0);
  assert.ok(result.includes("Make the number glow to increase focus"));
});

test('returns joy and storytelling specific suggestions', () => {
  const result = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(result.length > 0);
  assert.ok(result.includes("Add a bright, happy background"));
});

test('returns comparison and fear specific suggestions', () => {
  const result = getRefinementSuggestions('comparison', 'fear');
  assert.ok(result.length > 0);
  assert.ok(result.includes("Make the 'bad' side darker to increase contrast"));
  // "Add a split-screen divider for clear story separation" is added, but it gets sliced out because max items is 6.
  // We can just assert another property that doesn't get sliced or verify that it is in the full list by testing with a different combination.
});

test('returns general curiosity suggestions', () => {
  const result = getRefinementSuggestions('', 'curiosity');
  assert.ok(result.length > 0);
  assert.ok(result.includes("Add a '?' to the text to drive clicks"));
});

test('returns general joy suggestions', () => {
  const result = getRefinementSuggestions('', 'excitement');
  assert.ok(result.length > 0);
  assert.ok(result.includes("Increase color saturation to 100%"));
});

test('returns general authority suggestions', () => {
  const result = getRefinementSuggestions('expert', '');
  assert.ok(result.length > 0);
  assert.ok(result.includes("Add a professional badge or icon"));
});

test('limits results to 6 suggestions', () => {
  // Pass matching hooks to trigger multiple conditions
  const result = getRefinementSuggestions('comparison versus narrative expert listicle', 'fear urgency controversy');
  assert.ok(result.length <= 6);
});
