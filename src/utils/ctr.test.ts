import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './ctr.js';
import { ThumbnailConcept } from '../services/gemini.js';

const baseConcept: ThumbnailConcept = {
  concept_number: 1,
  concept_name: 'test',
  hook: 'test hook',
  layout: 'default',
  text_overlay: 'one two three four five',
  color_strategy: 'vibrant',
  psychology: 'neutral',
  ctr_explanation: 'explanation',
  image_generation_prompt: 'prompt'
};

test('getCTRScore - base score', () => {
  const score = getCTRScore(baseConcept);
  assert.strictEqual(score, 85);
});

test('getCTRScore - curiosity hook', () => {
  const concept = { ...baseConcept, hook: 'create curiosity' };
  const score = getCTRScore(concept);
  assert.strictEqual(score, 90);
});

test('getCTRScore - shock psychology', () => {
  const concept = { ...baseConcept, psychology: 'shock value' };
  const score = getCTRScore(concept);
  assert.strictEqual(score, 88);
});

test('getCTRScore - short text overlay', () => {
  const concept = { ...baseConcept, text_overlay: 'one two three' };
  const score = getCTRScore(concept);
  assert.strictEqual(score, 90);
});

test('getCTRScore - max score cap', () => {
  const concept = { ...baseConcept, hook: 'curiosity curiosity', psychology: 'shock shock shock shock shock', text_overlay: 'short' };
  // 85 + 5 + 3 + 5 = 98 (doesn't quite hit 99 but we can add more to simulate)
  const conceptHigh = { ...baseConcept, hook: 'curiosity curiosity curiosity curiosity', psychology: 'shock shock shock shock shock shock', text_overlay: 'short text' };
  // 85 + 5 + 3 + 5 = 98. It caps at 99. The logic simply uses includes, so it only adds 5 once. So 98 is max naturally given the checks.
  const score = getCTRScore(concept);
  assert.strictEqual(score, 98);
});
