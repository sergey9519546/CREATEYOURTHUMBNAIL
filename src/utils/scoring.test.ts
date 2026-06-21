import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore', async (t) => {
  await t.test('calculates base score', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'Test Hook',
      layout: 'Default',
      text_overlay: 'Word1 Word2 Word3 Word4 Word5',
      color_strategy: 'Vibrant',
      psychology: 'Test Psychology',
      ctr_explanation: 'Test',
      image_generation_prompt: 'Test prompt'
    } as ThumbnailConcept;
    const score = getCTRScore(concept);
    assert.strictEqual(score, 85);
  });

  await t.test('adds score for curiosity hook', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'This creates curiosity',
      layout: 'Default',
      text_overlay: 'Word1 Word2 Word3 Word4 Word5',
      color_strategy: 'Vibrant',
      psychology: 'Test Psychology',
      ctr_explanation: 'Test',
      image_generation_prompt: 'Test prompt'
    } as ThumbnailConcept;
    const score = getCTRScore(concept);
    assert.strictEqual(score, 90);
  });

  await t.test('adds score for shock psychology', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'Test Hook',
      layout: 'Default',
      text_overlay: 'Word1 Word2 Word3 Word4 Word5',
      color_strategy: 'Vibrant',
      psychology: 'It is a shock',
      ctr_explanation: 'Test',
      image_generation_prompt: 'Test prompt'
    } as ThumbnailConcept;
    const score = getCTRScore(concept);
    assert.strictEqual(score, 88);
  });

  await t.test('adds score for short text overlay', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'Test Hook',
      layout: 'Default',
      text_overlay: 'Word1 Word2 Word3',
      color_strategy: 'Vibrant',
      psychology: 'Test Psychology',
      ctr_explanation: 'Test',
      image_generation_prompt: 'Test prompt'
    } as ThumbnailConcept;
    const score = getCTRScore(concept);
    assert.strictEqual(score, 90);
  });

  await t.test('caps max score at 99', () => {
    const concept = {
      concept_number: 1,
      concept_name: 'Test',
      hook: 'This creates curiosity',
      layout: 'Default',
      text_overlay: 'Word1 Word2 Word3',
      color_strategy: 'Vibrant',
      psychology: 'It is a shock',
      ctr_explanation: 'Test',
      image_generation_prompt: 'Test prompt'
    } as ThumbnailConcept;
    const score = getCTRScore(concept);
    assert.strictEqual(score, 98); // 85 + 5 + 5 + 3 = 98 (within 99)
  });
});
