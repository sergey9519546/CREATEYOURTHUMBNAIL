import { test } from 'node:test';
import * as assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions', async (t) => {
  await t.test('returns default suggestions when no conditions match', () => {
    const result = getRefinementSuggestions('normal', 'normal');
    assert.strictEqual(result.length, 5);
    assert.ok(result.includes('Increase text size for mobile readability'));
    assert.ok(result.includes('Boost subject brightness by 20%'));
  });

  await t.test('handles curiosity and number', () => {
    const result = getRefinementSuggestions('number 5', 'curiosity gap');
    assert.ok(result.includes('Make the number glow to increase focus'));
    assert.ok(result.includes("Use a '?' instead of a digit to amplify mystery"));
    // also adds base curiosity suggestions
    assert.ok(result.includes("Add a '?' to the text to drive clicks"));
    // max 6 suggestions
    assert.strictEqual(result.length, 6);
  });

  await t.test('handles fear and comparison', () => {
    const result = getRefinementSuggestions('comparison test', 'fear factor');
    assert.ok(result.includes("Make the 'bad' side darker to increase contrast"));
    assert.ok(result.includes("Add a warning sign to the 'bad' side"));
    // also adds fear suggestions
    assert.ok(result.includes("Add a red border for urgency"));
    // also adds comparison suggestions
    // NOTE: It is truncated because Array.from(suggestions).slice(0, 6) is used.
    // Length is 6 because:
    // 1: Make the 'bad' side darker...
    // 2: Add a warning sign to...
    // 3: Use a red tint on...
    // 4: Make the 'good' side brighter...
    // 5: Add a red border for urgency
    // 6: Make the text bolder and more aggressive
    assert.strictEqual(result.length, 6);
  });

  await t.test('handles joy and storytelling', () => {
    const result = getRefinementSuggestions('storytelling time', 'joyful');
    assert.ok(result.includes("Add a bright, happy background"));
    // adds joy suggestions
    // NOTE: truncated.
    assert.strictEqual(result.length, 6);
  });

  await t.test('handles controversy', () => {
    const result = getRefinementSuggestions('normal', 'controversy');
    assert.ok(result.includes("Use a more confrontational pose"));
    assert.ok(result.includes("Add a 'vs' element"));
  });

  await t.test('handles authority', () => {
    const result = getRefinementSuggestions('authority figure', 'normal');
    assert.ok(result.includes("Add a professional badge or icon"));
    assert.ok(result.includes("Make the text cleaner and more authoritative"));
  });

  await t.test('handles listicle', () => {
    const result = getRefinementSuggestions('listicle post', 'normal');
    assert.ok(result.includes("Add a number badge for scannability"));
    assert.ok(result.includes("Use a grid layout for items"));
  });
});
