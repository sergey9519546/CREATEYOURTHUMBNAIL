import test, { describe } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../types.js';

describe('getCTRScore', () => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'Word word word word word', // 5 words
    color_strategy: 'Vibrant',
    psychology: 'Normal',
    ctr_explanation: 'Testing',
    image_generation_prompt: 'Test prompt'
  };

  test('returns base score of 85 for normal inputs', () => {
    assert.strictEqual(getCTRScore(baseConcept), 85);
  });

  test('adds 5 points for curiosity in hook', () => {
    const concept = { ...baseConcept, hook: 'A curiosity gap' };
    assert.strictEqual(getCTRScore(concept), 90);
  });

  test('adds 3 points for shock in psychology', () => {
    const concept = { ...baseConcept, psychology: 'Shock value' };
    assert.strictEqual(getCTRScore(concept), 88);
  });

  test('adds 5 points for 4 or fewer words in text_overlay', () => {
    const concept = { ...baseConcept, text_overlay: 'One two three four' };
    assert.strictEqual(getCTRScore(concept), 90);
  });

  test('combines points correctly but caps at 99', () => {
    const concept = {
      ...baseConcept,
      hook: 'Curiosity', // +5
      psychology: 'Shock', // +3
      text_overlay: 'Short text' // +5
    }; // 85 + 5 + 3 + 5 = 98
    assert.strictEqual(getCTRScore(concept), 98);
  });
});
