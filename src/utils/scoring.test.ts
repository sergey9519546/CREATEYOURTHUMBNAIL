import { test } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore - base score calculation', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'generic',
    layout: 'default',
    text_overlay: 'This has five words here',
    color_strategy: 'blue',
    psychology: 'generic',
    ctr_explanation: 'note',
    image_generation_prompt: 'prompt'
  };
  assert.strictEqual(getCTRScore(concept), 85, 'Base score should be 85');
});

test('getCTRScore - curiosity and short text bonus', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'curiosity gap',
    layout: 'default',
    text_overlay: 'Short text', // 2 words
    color_strategy: 'blue',
    psychology: 'generic',
    ctr_explanation: 'note',
    image_generation_prompt: 'prompt'
  };
  // 85 base + 5 curiosity + 5 short text = 95
  assert.strictEqual(getCTRScore(concept), 95, 'Score should include bonuses for curiosity and short text');
});

test('getCTRScore - shock bonus and capping', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'curiosity', // +5
    layout: 'default',
    text_overlay: 'Word', // +5
    color_strategy: 'blue',
    psychology: 'shock value', // +3
    ctr_explanation: 'note',
    image_generation_prompt: 'prompt'
  };
  // 85 + 5 + 5 + 3 = 98
  assert.strictEqual(getCTRScore(concept), 98, 'Score should be 98');
});
