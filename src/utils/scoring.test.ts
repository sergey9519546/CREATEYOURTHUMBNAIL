import { test } from 'node:test';
import assert from 'node:assert';
import { getCTRScore, getRefinementSuggestions } from './scoring';

test('getCTRScore tests', () => {
  const baseConcept = {
    concept_number: 1,
    concept_name: 'Test Concept',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'Long text overlay with many words',
    color_strategy: 'Vibrant',
    psychology: 'Normal',
    ctr_explanation: 'Testing',
    image_generation_prompt: 'Test prompt'
  };

  assert.strictEqual(getCTRScore(baseConcept), 85, 'Base score should be 85');

  const curiosityConcept = { ...baseConcept, hook: 'This is a curiosity hook' };
  assert.strictEqual(getCTRScore(curiosityConcept), 90, 'Curiosity adds 5 points');

  const shockConcept = { ...baseConcept, psychology: 'Shock value' };
  assert.strictEqual(getCTRScore(shockConcept), 88, 'Shock adds 3 points');

  const shortTextConcept = { ...baseConcept, text_overlay: 'Short text' };
  assert.strictEqual(getCTRScore(shortTextConcept), 90, 'Short text adds 5 points');

  const allConcept = {
    ...baseConcept,
    hook: 'Curiosity',
    psychology: 'Shock',
    text_overlay: 'Short text'
  };
  assert.strictEqual(getCTRScore(allConcept), 98, 'All modifiers applied correctly');
});

test('getRefinementSuggestions tests', () => {
  const suggestions1 = getRefinementSuggestions('Number 1 way', 'Curiosity');
  assert.ok(suggestions1.includes("Make the number glow to increase focus"));

  const suggestions2 = getRefinementSuggestions('Comparison', 'Fear');
  assert.ok(suggestions2.includes("Make the 'bad' side darker to increase contrast"));

  const suggestions3 = getRefinementSuggestions('Storytelling', 'Joy');
  assert.ok(suggestions3.includes("Add a bright, happy background"));

  const suggestions4 = getRefinementSuggestions('Normal', 'Controversy');
  assert.ok(suggestions4.includes("Add a 'vs' element"));
  assert.ok(suggestions4.length <= 6, 'Should return at most 6 suggestions');
});
