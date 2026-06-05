import { test } from 'node:test';
import * as assert from 'node:assert';
import { getCTRScore } from './ctr.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore base score', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'normal',
    layout: 'test',
    text_overlay: 'one two three four five', // 5 words = no bonus
    color_strategy: 'test',
    psychology: 'normal',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };

  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore curiosity bonus', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'this builds curiosity',
    layout: 'test',
    text_overlay: 'one two three four five',
    color_strategy: 'test',
    psychology: 'normal',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };

  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore shock bonus', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'normal',
    layout: 'test',
    text_overlay: 'one two three four five',
    color_strategy: 'test',
    psychology: 'shock value',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };

  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore text length bonus', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'normal',
    layout: 'test',
    text_overlay: 'short sweet bold', // 3 words
    color_strategy: 'test',
    psychology: 'normal',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };

  assert.strictEqual(getCTRScore(concept), 90); // 85 + 5
});

test('getCTRScore max cap', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'curiosity', // +5
    layout: 'test',
    text_overlay: 'short text', // +5
    color_strategy: 'test',
    psychology: 'shock', // +3
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };

  // 85 + 5 + 5 + 3 = 98
  assert.strictEqual(getCTRScore(concept), 98);
});
