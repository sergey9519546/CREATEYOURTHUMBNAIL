import { test } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';

test('getCTRScore calculations', () => {
  const baseConcept = {
    concept_number: 1,
    concept_name: 'Test',
    layout: 'Default',
    color_strategy: 'Vibrant',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test',
    hook: '',
    psychology: '',
    text_overlay: 'Word1 Word2 Word3 Word4 Word5'
  };

  assert.strictEqual(getCTRScore(baseConcept), 85);

  assert.strictEqual(getCTRScore({ ...baseConcept, hook: 'Curiosity gap' }), 90);
  assert.strictEqual(getCTRScore({ ...baseConcept, psychology: 'Shock value' }), 88);
  assert.strictEqual(getCTRScore({ ...baseConcept, text_overlay: 'Short text' }), 90);

  assert.strictEqual(getCTRScore({
    ...baseConcept,
    hook: 'Curiosity',
    psychology: 'Shock',
    text_overlay: 'Short'
  }), 98);
});
