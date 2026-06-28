import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';
import { ThumbnailConcept } from '../types';

test('getCTRScore', async (t) => {
  await t.test('calculates base score correctly', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'A regular hook',
      layout: 'Default',
      text_overlay: 'Some long text overlay here',
      color_strategy: 'Vibrant',
      psychology: 'Happiness',
      ctr_explanation: '',
      image_generation_prompt: ''
    } as ThumbnailConcept;

    assert.strictEqual(getCTRScore(concept), 85);
  });

  await t.test('adds points for curiosity hook', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'Curiosity gap',
      layout: 'Default',
      text_overlay: 'Some long text overlay here',
      color_strategy: 'Vibrant',
      psychology: 'Happiness',
      ctr_explanation: '',
      image_generation_prompt: ''
    } as ThumbnailConcept;

    assert.strictEqual(getCTRScore(concept), 90);
  });

  await t.test('adds points for shock psychology', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'A regular hook',
      layout: 'Default',
      text_overlay: 'Some long text overlay here',
      color_strategy: 'Vibrant',
      psychology: 'Shock value',
      ctr_explanation: '',
      image_generation_prompt: ''
    } as ThumbnailConcept;

    assert.strictEqual(getCTRScore(concept), 88);
  });

  await t.test('adds points for short text overlay', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'A regular hook',
      layout: 'Default',
      text_overlay: 'Short text',
      color_strategy: 'Vibrant',
      psychology: 'Happiness',
      ctr_explanation: '',
      image_generation_prompt: ''
    } as ThumbnailConcept;

    assert.strictEqual(getCTRScore(concept), 90);
  });

  await t.test('caps score at 99', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'Curiosity gap',
      layout: 'Default',
      text_overlay: 'Short text',
      color_strategy: 'Vibrant',
      psychology: 'Shock value',
      ctr_explanation: '',
      image_generation_prompt: ''
    } as ThumbnailConcept;

    // 85 + 5 + 3 + 5 = 98. If we were to start at 90, it would cap at 99.
    assert.strictEqual(getCTRScore(concept), 98);
  });
});
