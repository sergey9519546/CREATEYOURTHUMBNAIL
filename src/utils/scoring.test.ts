import { test } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';
import { ThumbnailConcept } from '../types';

test('getCTRScore base score', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'normal',
    layout: 'grid',
    text_overlay: 'one two three four five', // 5 words
    color_strategy: 'red',
    psychology: 'normal',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore with curiosity hook', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'curiosity gap',
    layout: 'grid',
    text_overlay: 'one two three four five',
    color_strategy: 'red',
    psychology: 'normal',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore with shock psychology', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'normal',
    layout: 'grid',
    text_overlay: 'one two three four five',
    color_strategy: 'red',
    psychology: 'shocking result',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };
  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore with short text overlay', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'normal',
    layout: 'grid',
    text_overlay: 'one two three', // 3 words
    color_strategy: 'red',
    psychology: 'normal',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore max score cap', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: 'curiosity',
    layout: 'grid',
    text_overlay: 'one two',
    color_strategy: 'red',
    psychology: 'shock',
    ctr_explanation: 'test',
    image_generation_prompt: 'test'
  };
  // 85 + 5 + 3 + 5 = 98
  assert.strictEqual(getCTRScore(concept), 98);
});
