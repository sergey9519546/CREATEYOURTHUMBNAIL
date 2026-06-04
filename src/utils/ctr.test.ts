import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './ctr.js';
import { ThumbnailConcept } from '../services/gemini.js';

const mockConcept = (overrides?: Partial<ThumbnailConcept>): ThumbnailConcept => ({
  concept_number: 1,
  concept_name: 'Test Concept',
  psychology: 'Standard',
  hook: 'Standard hook',
  layout: 'Standard layout',
  color_strategy: 'Test color',
  ctr_explanation: 'Test explanation',
  text_overlay: 'This is a long test text overlay',
  image_generation_prompt: 'A test prompt',
  ...overrides,
});

test('getCTRScore default score', () => {
  const concept = mockConcept();
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore adds points for curiosity hook', () => {
  const concept = mockConcept({ hook: 'Curiosity approach' });
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore adds points for shock psychology', () => {
  const concept = mockConcept({ psychology: 'Shock value' });
  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore adds points for short text overlay', () => {
  const concept = mockConcept({ text_overlay: 'Short text' });
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore combines points correctly and caps at 99', () => {
  const concept = mockConcept({
    hook: 'Curiosity',
    psychology: 'Shock',
    text_overlay: 'Very short'
  });
  // Base 85 + 5 (curiosity) + 3 (shock) + 5 (short text) = 98
  assert.strictEqual(getCTRScore(concept), 98);
});
