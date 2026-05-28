import { test } from 'node:test';
import * as assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

const mockConcept = (overrides: Partial<ThumbnailConcept>): ThumbnailConcept => ({
  concept_number: 1,
  concept_name: 'Test',
  hook: 'Test Hook',
  layout: 'Default',
  text_overlay: 'Hello world',
  color_strategy: 'Vibrant',
  psychology: 'None',
  ctr_explanation: 'Testing',
  image_generation_prompt: 'prompt',
  ...overrides
});

test('getCTRScore - base score is 85', () => {
  const concept = mockConcept({ hook: 'basic', psychology: 'basic', text_overlay: 'one two three four five' });
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore - curiosity hook adds 5', () => {
  const concept = mockConcept({ hook: 'Curiosity gap', psychology: 'basic', text_overlay: 'one two three four five' });
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore - shock psychology adds 3', () => {
  const concept = mockConcept({ hook: 'basic', psychology: 'Shocking', text_overlay: 'one two three four five' });
  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore - short text adds 5', () => {
  const concept = mockConcept({ hook: 'basic', psychology: 'basic', text_overlay: 'short text' });
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore - combines bonuses up to 99 max', () => {
  const concept = mockConcept({ hook: 'Curiosity', psychology: 'Shock', text_overlay: 'very short text' });
  assert.strictEqual(getCTRScore(concept), 98);

  // if base was somehow higher, it caps at 99
  const conceptMax = mockConcept({ hook: 'Curiosity curiosity curiosity', psychology: 'Shock shock', text_overlay: 'text' });
  assert.strictEqual(getCTRScore(conceptMax) <= 99, true);
});
