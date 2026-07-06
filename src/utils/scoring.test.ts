import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';
import { ThumbnailConcept } from '../types';

describe('getCTRScore', () => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: '',
    layout: 'Default',
    text_overlay: 'One two three four five', // 5 words
    color_strategy: 'Vibrant',
    psychology: '',
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  test('returns base score of 85 for empty/non-matching conditions', () => {
    assert.strictEqual(getCTRScore(baseConcept), 85);
  });

  test('adds 5 points for curiosity hook', () => {
    const concept = { ...baseConcept, hook: 'Curiosity gap' };
    assert.strictEqual(getCTRScore(concept), 90);
  });

  test('adds 3 points for shock psychology', () => {
    const concept = { ...baseConcept, psychology: 'Shock value' };
    assert.strictEqual(getCTRScore(concept), 88);
  });

  test('adds 5 points for short text overlay (<= 4 words)', () => {
    const concept = { ...baseConcept, text_overlay: 'One two three four' };
    assert.strictEqual(getCTRScore(concept), 90);
  });

  test('adds all points if all conditions match, capped at 99', () => {
    const concept = {
      ...baseConcept,
      hook: 'Curiosity gap',
      psychology: 'Shock value',
      text_overlay: 'Short text'
    };
    // 85 + 5 + 3 + 5 = 98
    assert.strictEqual(getCTRScore(concept), 98);
  });
});
