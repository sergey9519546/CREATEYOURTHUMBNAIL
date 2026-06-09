import { test } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore base score and modifiers', () => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'Word1 Word2 Word3 Word4 Word5',
    color_strategy: 'Normal',
    psychology: 'Normal',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test'
  };

  // Base score 85
  assert.strictEqual(getCTRScore(baseConcept), 85);

  // Curiosity modifier (+5)
  const curiosityConcept = { ...baseConcept, hook: 'Curiosity gap' };
  assert.strictEqual(getCTRScore(curiosityConcept), 90);

  // Shock modifier (+3)
  const shockConcept = { ...baseConcept, psychology: 'Shock value' };
  assert.strictEqual(getCTRScore(shockConcept), 88);

  // Short text modifier (+5)
  const shortTextConcept = { ...baseConcept, text_overlay: 'Short text' };
  assert.strictEqual(getCTRScore(shortTextConcept), 90);

  // All modifiers combined, capped at 99 (85 + 5 + 3 + 5 = 98)
  const allModifiersConcept = {
    ...baseConcept,
    hook: 'Curiosity',
    psychology: 'Shock',
    text_overlay: 'Short'
  };
  assert.strictEqual(getCTRScore(allModifiersConcept), 98);
});
