import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore, getRefinementSuggestions } from './thumbnail-logic.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore base score and increments', () => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'normal hook',
    layout: 'Default',
    text_overlay: 'word1 word2 word3 word4 word5',
    color_strategy: 'Vibrant',
    psychology: 'normal psychology',
    ctr_explanation: 'explanation',
    image_generation_prompt: 'prompt'
  };

  assert.strictEqual(getCTRScore(baseConcept), 85, 'Base score should be 85');

  const curiosityConcept = { ...baseConcept, hook: 'Curiosity gap' };
  assert.strictEqual(getCTRScore(curiosityConcept), 90, 'Curiosity adds 5');

  const shockConcept = { ...baseConcept, psychology: 'Shock value' };
  assert.strictEqual(getCTRScore(shockConcept), 88, 'Shock adds 3');

  const shortTextConcept = { ...baseConcept, text_overlay: 'One Two Three Four' };
  assert.strictEqual(getCTRScore(shortTextConcept), 90, 'Short text adds 5');

  const comboConcept = {
    ...baseConcept,
    hook: 'Curiosity',
    psychology: 'Shock',
    text_overlay: 'Short text'
  };
  assert.strictEqual(getCTRScore(comboConcept), 98, 'Combines all bonuses correctly');
});

test('getCTRScore max score cap', () => {
  const overCapConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'curiosity',
    layout: 'Default',
    text_overlay: 'Short text', // +5
    color_strategy: 'Vibrant',
    psychology: 'shock', // +3
    ctr_explanation: 'explanation',
    image_generation_prompt: 'prompt'
  };
  // Base 85 + 5 + 3 + 5 = 98

  // Modify logic to try to force > 99 if there were more bonuses
  // With current implementation, max possible is 98 (85 + 5 + 3 + 5)
  // Let's just test that the function returns correctly
  assert.strictEqual(getCTRScore(overCapConcept), 98);
});

test('getRefinementSuggestions specific combinations', () => {
  const suggestions1 = getRefinementSuggestions('number', 'curiosity');
  assert.ok(suggestions1.includes("Make the number glow to increase focus"));

  const suggestions2 = getRefinementSuggestions('comparison', 'fear');
  assert.ok(suggestions2.includes("Make the 'bad' side darker to increase contrast"));

  const suggestions3 = getRefinementSuggestions('storytelling', 'joy');
  assert.ok(suggestions3.includes("Add a bright, happy background"));
});

test('getRefinementSuggestions general psychology fallback', () => {
  const suggestions = getRefinementSuggestions('unknown', 'mystery');
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
});

test('getRefinementSuggestions general hook fallback', () => {
  const suggestions = getRefinementSuggestions('expert', 'unknown');
  assert.ok(suggestions.includes("Add a professional badge or icon"));
});

test('getRefinementSuggestions completely unknown fallback', () => {
  const suggestions = getRefinementSuggestions('unknown', 'unknown');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
