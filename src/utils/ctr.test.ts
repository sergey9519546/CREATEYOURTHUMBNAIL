import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './ctr.js';
import { ThumbnailConcept } from '../services/gemini';

test('getCTRScore base score', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'This is a normal text overlay',
    color_strategy: 'Vibrant',
    psychology: 'Normal',
    ctr_explanation: 'Normal',
    image_generation_prompt: 'Normal'
  };

  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore curiosity boost', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'curiosity hook',
    layout: 'Default',
    text_overlay: 'This is a normal text overlay',
    color_strategy: 'Vibrant',
    psychology: 'Normal',
    ctr_explanation: 'Normal',
    image_generation_prompt: 'Normal'
  };

  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore shock boost', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'This is a normal text overlay',
    color_strategy: 'Vibrant',
    psychology: 'Shock value',
    ctr_explanation: 'Normal',
    image_generation_prompt: 'Normal'
  };

  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore text length boost', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'Short text', // 2 words
    color_strategy: 'Vibrant',
    psychology: 'Normal',
    ctr_explanation: 'Normal',
    image_generation_prompt: 'Normal'
  };

  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore max cap', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Curiosity hook',
    layout: 'Default',
    text_overlay: 'Short text', // 2 words
    color_strategy: 'Vibrant',
    psychology: 'Shock value',
    ctr_explanation: 'Normal',
    image_generation_prompt: 'Normal'
  };

  // 85 + 5 + 3 + 5 = 98
  assert.strictEqual(getCTRScore(concept), 98);
});
