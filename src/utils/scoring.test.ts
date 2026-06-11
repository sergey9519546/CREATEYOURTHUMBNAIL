import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore base functionality', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'basic hook',
    layout: 'Default',
    text_overlay: 'one two three four five',
    color_strategy: 'Vibrant',
    psychology: 'basic psych',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test',
  };

  const score = getCTRScore(concept);
  assert.strictEqual(score, 85);
});

test('getCTRScore adds points for curiosity and short text', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'a curiosity gap',
    layout: 'Default',
    text_overlay: 'one two three', // short text
    color_strategy: 'Vibrant',
    psychology: 'basic psych',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test',
  };

  const score = getCTRScore(concept);
  assert.strictEqual(score, 95); // 85 base + 5 curiosity + 5 short text
});

test('getCTRScore caps score at 99', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'curiosity gap',
    layout: 'Default',
    text_overlay: 'short',
    color_strategy: 'Vibrant',
    psychology: 'shock value',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test',
  };

  const score = getCTRScore(concept);
  assert.strictEqual(score, 98); // 85 + 5 + 3 + 5 = 98 (under cap, but covers all modifiers)
});
