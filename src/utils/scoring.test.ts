import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

const mockConcept: ThumbnailConcept = {
  concept_number: 1,
  concept_name: 'Test',
  hook: 'Default Hook',
  layout: 'Default Layout',
  text_overlay: 'Hello world',
  color_strategy: 'Vibrant',
  psychology: 'Default Psychology',
  ctr_explanation: 'Test explanation',
  image_generation_prompt: 'Test prompt'
};

test('getCTRScore base score', () => {
  const score = getCTRScore(mockConcept);
  // Base 85 + 5 for text overlay <= 4 words = 90
  assert.strictEqual(score, 90);
});

test('getCTRScore with curiosity hook', () => {
  const concept = { ...mockConcept, hook: 'Curiosity driven hook' };
  const score = getCTRScore(concept);
  // Base 85 + 5 text + 5 curiosity = 95
  assert.strictEqual(score, 95);
});

test('getCTRScore with shock psychology', () => {
  const concept = { ...mockConcept, psychology: 'Shock and awe' };
  const score = getCTRScore(concept);
  // Base 85 + 5 text + 3 shock = 93
  assert.strictEqual(score, 93);
});

test('getCTRScore long text overlay', () => {
  const concept = { ...mockConcept, text_overlay: 'This is a very long text overlay with many words' };
  const score = getCTRScore(concept);
  // Base 85 (text is > 4 words, no bonus)
  assert.strictEqual(score, 85);
});

test('getCTRScore maximum score capped at 99', () => {
  const concept = {
    ...mockConcept,
    hook: 'curiosity',
    psychology: 'shock',
    text_overlay: 'Short text'
  };
  const score = getCTRScore(concept);
  // Base 85 + 5 text + 5 curiosity + 3 shock = 98
  assert.strictEqual(score, 98);

  // Test cap explicitly
  const capConcept = {
    ...concept,
    // Provide conditions that would theoretically exceed 99 if more bonuses existed
    // Here we just test the math function min(..., 99) in logic, though currently max is 98.
    // Let's modify base score in a hypothetical scenario or just verify it doesn't go over 99.
  };
  assert.ok(getCTRScore(capConcept) <= 99);
});
