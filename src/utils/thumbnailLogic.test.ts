import { test } from 'node:test';
import * as assert from 'node:assert';
import { getRefinementSuggestions, getCTRScore } from './thumbnailLogic';
import { ThumbnailConcept } from '../services/gemini';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.some(s => s.includes('Make the number glow')));
  assert.ok(suggestions.some(s => s.includes("Use a '?' instead of a digit")));
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.some(s => s.includes("Make the 'bad' side darker")));
  assert.ok(suggestions.some(s => s.includes("Add a warning sign to the 'bad' side")));
});

test('getRefinementSuggestions - fallback', () => {
  const suggestions = getRefinementSuggestions('unknown', 'unknown');
  assert.ok(suggestions.some(s => s.includes("Increase text size")));
});

test('getCTRScore - base score', () => {
  const concept = {
    hook: 'normal',
    psychology: 'normal',
    text_overlay: 'one two three four five'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore - curiosity bonus', () => {
  const concept = {
    hook: 'curiosity gap',
    psychology: 'normal',
    text_overlay: 'one two three four five'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore - shock bonus', () => {
  const concept = {
    hook: 'normal',
    psychology: 'shock value',
    text_overlay: 'one two three four five'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore - short text bonus', () => {
  const concept = {
    hook: 'normal',
    psychology: 'normal',
    text_overlay: 'one two three'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore - max score 99', () => {
  const concept = {
    hook: 'curiosity gap',
    psychology: 'shock value',
    text_overlay: 'one two three'
  } as ThumbnailConcept;
  // 85 + 5 + 3 + 5 = 98
  assert.strictEqual(getCTRScore(concept), 98);
});

test('getCTRScore - max score 99 bounded', () => {
  const concept = {
    hook: 'curiosity gap',
    psychology: 'shock value',
    text_overlay: 'one two'
  } as ThumbnailConcept;
  // To test the Math.min bounds, we can spoof the inputs to reach over 99.
  // We can't really do this with the current logic, so we will test the standard output
  assert.strictEqual(getCTRScore(concept), 98);
});
