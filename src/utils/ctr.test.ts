import { test } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './ctr.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore base score', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'test',
    layout: 'test',
    text_overlay: 'one two three four five',
    color_strategy: 'test',
    psychology: 'test',
    ctr_explanation: 'test',
    image_generation_prompt: 'test',
  };
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore curiosity', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'CURIOSITY test',
    layout: 'test',
    text_overlay: 'one two three four five',
    color_strategy: 'test',
    psychology: 'test',
    ctr_explanation: 'test',
    image_generation_prompt: 'test',
  };
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore shock', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'test',
    layout: 'test',
    text_overlay: 'one two three four five',
    color_strategy: 'test',
    psychology: 'shocking',
    ctr_explanation: 'test',
    image_generation_prompt: 'test',
  };
  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore text overlay words <= 4', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'test',
    layout: 'test',
    text_overlay: 'one two three four',
    color_strategy: 'test',
    psychology: 'test',
    ctr_explanation: 'test',
    image_generation_prompt: 'test',
  };
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore all factors capped at 99', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'curiosity',
    layout: 'test',
    text_overlay: 'one two',
    color_strategy: 'test',
    psychology: 'shock',
    ctr_explanation: 'test',
    image_generation_prompt: 'test',
  };
  // 85 + 5 + 3 + 5 = 98
  assert.strictEqual(getCTRScore(concept), 98);
});
