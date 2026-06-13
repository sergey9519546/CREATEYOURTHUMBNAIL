import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore', async (t) => {
  await t.test('calculates base score', () => {
    const concept: ThumbnailConcept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'regular hook',
      layout: 'Default',
      text_overlay: 'one two three four five',
      color_strategy: 'Vibrant',
      psychology: 'regular psychology',
      ctr_explanation: 'explanation',
      image_generation_prompt: 'prompt'
    };

    assert.strictEqual(getCTRScore(concept), 85);
  });

  await t.test('adds 5 points for curiosity hook', () => {
    const concept: ThumbnailConcept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'this curiosity gap is huge',
      layout: 'Default',
      text_overlay: 'one two three four five',
      color_strategy: 'Vibrant',
      psychology: 'regular psychology',
      ctr_explanation: 'explanation',
      image_generation_prompt: 'prompt'
    };

    assert.strictEqual(getCTRScore(concept), 90);
  });

  await t.test('adds 3 points for shock psychology', () => {
    const concept: ThumbnailConcept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'regular hook',
      layout: 'Default',
      text_overlay: 'one two three four five',
      color_strategy: 'Vibrant',
      psychology: 'shock value',
      ctr_explanation: 'explanation',
      image_generation_prompt: 'prompt'
    };

    assert.strictEqual(getCTRScore(concept), 88);
  });

  await t.test('adds 5 points for short text overlay', () => {
    const concept: ThumbnailConcept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'regular hook',
      layout: 'Default',
      text_overlay: 'one two three', // 3 words
      color_strategy: 'Vibrant',
      psychology: 'regular psychology',
      ctr_explanation: 'explanation',
      image_generation_prompt: 'prompt'
    };

    assert.strictEqual(getCTRScore(concept), 90);
  });

  await t.test('combines multiple bonuses but caps at 99', () => {
    const concept: ThumbnailConcept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'curiosity hook', // +5
      layout: 'Default',
      text_overlay: 'short text', // +5
      color_strategy: 'Vibrant',
      psychology: 'shock psychology', // +3
      ctr_explanation: 'explanation',
      image_generation_prompt: 'prompt'
    };

    // 85 + 5 + 5 + 3 = 98
    assert.strictEqual(getCTRScore(concept), 98);
  });
});
