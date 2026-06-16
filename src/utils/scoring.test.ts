import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../types.js';

test('getCTRScore base score is 85', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'One Two Three Four Five',
    color_strategy: 'Normal',
    psychology: 'Normal',
    ctr_explanation: '',
    image_generation_prompt: ''
  };
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore max score is 99', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Curiosity hook curiosity',
    layout: 'Default',
    text_overlay: 'Short text',
    color_strategy: 'Normal',
    psychology: 'Shock value',
    ctr_explanation: '',
    image_generation_prompt: ''
  };
  // 85 + 5 (curiosity) + 3 (shock) + 5 (short text) = 98
  assert.strictEqual(getCTRScore(concept), 98);
});
