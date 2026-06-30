import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';
import { ThumbnailConcept } from '../types';

describe('getCTRScore', () => {
  test('calculates base score correctly', () => {
    const concept: ThumbnailConcept = {
      concept_number: 1,
      concept_name: 'test',
      hook: 'normal',
      layout: 'test',
      text_overlay: 'one two three four five',
      color_strategy: 'test',
      psychology: 'normal',
      ctr_explanation: 'test',
      image_generation_prompt: 'test'
    };

    assert.strictEqual(getCTRScore(concept), 85);
  });

  test('adds points for curiosity hook and short text', () => {
    const concept: ThumbnailConcept = {
      concept_number: 1,
      concept_name: 'test',
      hook: 'curiosity gap',
      layout: 'test',
      text_overlay: 'short text',
      color_strategy: 'test',
      psychology: 'normal',
      ctr_explanation: 'test',
      image_generation_prompt: 'test'
    };

    assert.strictEqual(getCTRScore(concept), 85 + 5 + 5);
  });
});
