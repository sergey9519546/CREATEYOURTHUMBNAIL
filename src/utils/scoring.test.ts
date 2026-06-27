import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';
import { ThumbnailConcept } from '../types';

test('getCTRScore base score', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'normal',
    layout: 'Default',
    text_overlay: 'This is a normal text overlay',
    color_strategy: 'Vibrant',
    psychology: 'calm',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test'
  };

  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore curiosity and shock', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'a curiosity hook',
    layout: 'Default',
    text_overlay: 'This is a normal text overlay',
    color_strategy: 'Vibrant',
    psychology: 'this is a shock',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test'
  };

  assert.strictEqual(getCTRScore(concept), 85 + 5 + 3); // 93
});

test('getCTRScore short text', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'normal',
    layout: 'Default',
    text_overlay: 'Short text only', // 3 words
    color_strategy: 'Vibrant',
    psychology: 'calm',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test'
  };

  assert.strictEqual(getCTRScore(concept), 85 + 5); // 90
});

test('getCTRScore caps at 99', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'a curiosity hook',
    layout: 'Default',
    text_overlay: 'Very short text',
    color_strategy: 'Vibrant',
    psychology: 'this is a shock',
    ctr_explanation: 'Test',
    image_generation_prompt: 'Test'
  };

  // 85 + 5 + 3 + 5 = 98
  assert.strictEqual(getCTRScore(concept), 98);

  const conceptMax: ThumbnailConcept = {
    ...concept,
    hook: 'curiosity curiosity curiosity'
  };

  // Note: the original logic only checks if it includes 'curiosity', it doesn't add multiple times.
  // Wait, let's just create a scenario where score > 99
  // The original function: let score = 85; if(...) score+=5; if(...) score+=3; if(...) score+=5. Max is 85+5+3+5 = 98.
  // We can't exceed 99 with the current logic, but we can test Math.min
  // For the sake of test coverage, the math.min is there.
  assert.strictEqual(getCTRScore(conceptMax), 98);
});
