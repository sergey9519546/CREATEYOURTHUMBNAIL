import { test } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../types.js';

test('getCTRScore calculates correct score', () => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'Word1 Word2 Word3 Word4 Word5',
    color_strategy: 'Normal',
    psychology: 'Normal',
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  // Base score
  assert.strictEqual(getCTRScore(baseConcept), 85);

  // With curiosity hook
  const curiosityConcept = { ...baseConcept, hook: 'A curiosity gap hook' };
  assert.strictEqual(getCTRScore(curiosityConcept), 90);

  // With shock psychology
  const shockConcept = { ...baseConcept, psychology: 'Shock and awe' };
  assert.strictEqual(getCTRScore(shockConcept), 88);

  // With short text (<= 4 words)
  const shortTextConcept = { ...baseConcept, text_overlay: 'Short text here' };
  assert.strictEqual(getCTRScore(shortTextConcept), 90);

  // Max score is capped at 99
  const maxConcept = {
    ...baseConcept,
    hook: 'curiosity',
    psychology: 'shock',
    text_overlay: 'Short text' // 2 words
  };
  // 85 + 5 + 3 + 5 = 98
  assert.strictEqual(getCTRScore(maxConcept), 98);
});
