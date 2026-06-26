import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';
import { ThumbnailConcept } from '../types';

test('getCTRScore calculations', () => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Test hook',
    layout: 'Default',
    text_overlay: 'Word1 Word2 Word3 Word4 Word5',
    color_strategy: 'Red',
    psychology: 'Test psych',
    ctr_explanation: 'Expl',
    image_generation_prompt: 'Prompt',
  };

  assert.strictEqual(getCTRScore(baseConcept), 85, 'Base score should be 85');

  const curiosityConcept = { ...baseConcept, hook: 'This is a curiosity hook' };
  assert.strictEqual(getCTRScore(curiosityConcept), 90, 'Curiosity adds 5 points');

  const shockConcept = { ...baseConcept, psychology: 'Uses shock value' };
  assert.strictEqual(getCTRScore(shockConcept), 88, 'Shock adds 3 points');

  const shortTextConcept = { ...baseConcept, text_overlay: '1 2 3 4' };
  assert.strictEqual(getCTRScore(shortTextConcept), 90, 'Short text adds 5 points');

  const maxConcept = {
    ...baseConcept,
    hook: 'curiosity',
    psychology: 'shock',
    text_overlay: 'short text'
  };
  assert.strictEqual(getCTRScore(maxConcept), 98, 'Max score combines all bonuses');
});
