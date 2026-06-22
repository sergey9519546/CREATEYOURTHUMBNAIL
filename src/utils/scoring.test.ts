import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../types.js';

test('getCTRScore calculations', async (t) => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal',
    layout: 'Default',
    text_overlay: 'Word1 Word2 Word3 Word4 Word5', // 5 words
    color_strategy: 'Vibrant',
    psychology: 'Joy',
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  await t.test('calculates base score without bonuses', () => {
    assert.strictEqual(getCTRScore(baseConcept), 85);
  });

  await t.test('adds +5 for curiosity in hook', () => {
    assert.strictEqual(getCTRScore({ ...baseConcept, hook: 'Has CUrIOSITY' }), 90);
  });

  await t.test('adds +3 for shock in psychology', () => {
    assert.strictEqual(getCTRScore({ ...baseConcept, psychology: 'is SHOCKing' }), 88);
  });

  await t.test('adds +5 for 4 or fewer words in text_overlay', () => {
    assert.strictEqual(getCTRScore({ ...baseConcept, text_overlay: 'One Two Three' }), 90);
  });

  await t.test('combines all bonuses and caps at 99', () => {
    const maxConcept = {
      ...baseConcept,
      hook: 'curiosity',
      psychology: 'shock',
      text_overlay: 'short text'
    };
    // 85 + 5 + 3 + 5 = 98
    assert.strictEqual(getCTRScore(maxConcept), 98);
  });
});
