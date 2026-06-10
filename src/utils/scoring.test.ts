import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../types.js';

test('getCTRScore calculates base score', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Test hook',
    layout: 'Test layout',
    text_overlay: 'Word1 Word2 Word3 Word4 Word5',
    color_strategy: 'Red',
    psychology: 'Test',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test',
  };

  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore adds 5 for curiosity hook', () => {
  const concept = { hook: 'A curiosity hook', psychology: '', text_overlay: '1 2 3 4 5' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore adds 3 for shock psychology', () => {
  const concept = { hook: '', psychology: 'A shock feeling', text_overlay: '1 2 3 4 5' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore adds 5 for short text overlay', () => {
  const concept = { hook: '', psychology: '', text_overlay: 'Short text' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore maxes at 98 for all bonuses', () => {
  const concept = { hook: 'curiosity', psychology: 'shock', text_overlay: 'Short' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 98); // 85 + 5 + 3 + 5
});
