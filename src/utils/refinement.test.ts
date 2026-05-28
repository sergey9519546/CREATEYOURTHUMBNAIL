import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions, getCTRScore } from './refinement.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getRefinementSuggestions returns suggestions for curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions returns suggestions for fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions returns suggestions for joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Add a bright, happy background"));
});

test('getRefinementSuggestions returns fallback suggestions when no specific match is found', () => {
  const suggestions = getRefinementSuggestions('random', 'unknown');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions returns up to 6 suggestions', () => {
  const suggestions = getRefinementSuggestions('number comparison', 'curiosity fear');
  assert.ok(suggestions.length <= 6);
});

const baseConcept: ThumbnailConcept = {
  concept_number: 1,
  concept_name: 'Test',
  hook: 'Test Hook',
  layout: 'Default',
  text_overlay: 'Test text',
  color_strategy: 'Vibrant',
  psychology: 'Test psychology',
  ctr_explanation: 'Test',
  image_generation_prompt: 'Test prompt'
};

test('getCTRScore base score is 85', () => {
  const concept = { ...baseConcept };
  // Hook does not include curiosity, psychology does not include shock, text has <=4 words (adds 5)
  // base (85) + text (5) = 90
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore adds 5 for curiosity hook', () => {
  const concept = { ...baseConcept, hook: 'This is a curiosity hook' };
  // base (85) + curiosity (5) + text (5) = 95
  assert.strictEqual(getCTRScore(concept), 95);
});

test('getCTRScore adds 3 for shock psychology', () => {
  const concept = { ...baseConcept, psychology: 'This is a shock psychology' };
  // base (85) + shock (3) + text (5) = 93
  assert.strictEqual(getCTRScore(concept), 93);
});

test('getCTRScore adds 5 for short text', () => {
  const concept = { ...baseConcept, text_overlay: 'Short text here' };
  // base (85) + text (5) = 90
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore does not add 5 for long text', () => {
  const concept = { ...baseConcept, text_overlay: 'This is a very long text overlay with more than four words' };
  // base (85) = 85
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore caps score at 99', () => {
  const concept = {
    ...baseConcept,
    hook: 'Curiosity',
    psychology: 'Shock',
    text_overlay: 'Short'
  };
  assert.ok(getCTRScore(concept) <= 99);
});
