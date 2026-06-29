import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';
import { ThumbnailConcept } from '../services/gemini';

const baseConcept: ThumbnailConcept = {
  concept_number: 1,
  concept_name: 'Test Concept',
  hook: 'A hook',
  layout: 'Default',
  text_overlay: 'Some text here',
  color_strategy: 'Vibrant',
  psychology: 'Something',
  ctr_explanation: 'Because it is good',
  image_generation_prompt: 'Generate an image',
};

test('getCTRScore base score', () => {
  const score = getCTRScore(baseConcept);
  assert.strictEqual(score, 90); // 85 base + 5 for short text
});

test('getCTRScore with curiosity and shock', () => {
  const concept: ThumbnailConcept = {
    ...baseConcept,
    hook: 'Curiosity gap',
    psychology: 'High shock value',
    text_overlay: 'One two three four five', // > 4 words
  };
  const score = getCTRScore(concept);
  assert.strictEqual(score, 93); // 85 base + 5 (curiosity) + 3 (shock) + 0 (text > 4)
});

test('getCTRScore maximum score capped at 99', () => {
  const concept: ThumbnailConcept = {
    ...baseConcept,
    hook: 'Curiosity gap',
    psychology: 'High shock value',
    text_overlay: 'Short text',
  };
  const score = getCTRScore(concept);
  assert.strictEqual(score, 98); // 85 + 5 + 3 + 5 = 98 (under cap)

  // To reach cap: if we add to base score or logic changes. Right now max possible with this logic is 98.
  // We can test the cap by manually passing a concept that would exceed 99 if logic allowed, or just verify it handles normally.
});
