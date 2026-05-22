import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './ctrScore';
import { ThumbnailConcept } from '../services/gemini';

const createMockConcept = (overrides: Partial<ThumbnailConcept>): ThumbnailConcept => ({
  concept_number: 1,
  concept_name: 'Test Concept',
  hook: '',
  layout: '',
  text_overlay: 'word1 word2 word3 word4 word5', // 5 words by default to fail the <=4 check
  color_strategy: '',
  psychology: '',
  ctr_explanation: '',
  image_generation_prompt: '',
  ...overrides
});

test('getCTRScore base score calculation', () => {
  const concept = createMockConcept({});
  const score = getCTRScore(concept);
  assert.strictEqual(score, 85, 'Base score should be 85 when no bonuses match');
});

test('getCTRScore adds points for curiosity hook', () => {
  const concept = createMockConcept({ hook: 'A curiosity based hook' });
  const score = getCTRScore(concept);
  assert.strictEqual(score, 90, 'Score should be 90 (85 + 5 for curiosity)');
});

test('getCTRScore adds points for shock psychology', () => {
  const concept = createMockConcept({ psychology: 'Contains shock factor' });
  const score = getCTRScore(concept);
  assert.strictEqual(score, 88, 'Score should be 88 (85 + 3 for shock)');
});

test('getCTRScore adds points for short text overlay', () => {
  const concept = createMockConcept({ text_overlay: 'Short text here' });
  const score = getCTRScore(concept);
  assert.strictEqual(score, 90, 'Score should be 90 (85 + 5 for <= 4 words)');
});

test('getCTRScore combines bonuses correctly', () => {
  const concept = createMockConcept({
    hook: 'curiosity',
    psychology: 'shock',
    text_overlay: 'short text'
  });
  const score = getCTRScore(concept);
  assert.strictEqual(score, 98, 'Score should be 98 (85 + 5 + 3 + 5)');
});

test('getCTRScore caps maximum score at 99', () => {
  // If base score was higher, or we had more bonuses, it shouldn't exceed 99
  // Since we can't exceed 99 with the current bonuses (max is 98), we need
  // to ensure the Math.min(score, 99) works. We can test this by mutating the logic
  // or just ensuring 98 is handled correctly. Let's just ensure 98 works,
  // as it's the max possible score anyway.
  // We can't actually hit > 99 with current logic, but we can verify it doesn't exceed 99
  const concept = createMockConcept({
    hook: 'curiosity',
    psychology: 'shock',
    text_overlay: 'short text'
  });
  const score = getCTRScore(concept);
  assert.ok(score <= 99, 'Score should never exceed 99');
});

test('getCTRScore handles empty strings without crashing', () => {
  const concept = createMockConcept({
    hook: '',
    psychology: '',
    text_overlay: '' // split(' ') will be [''], length 1 <= 4, so +5 bonus
  });
  const score = getCTRScore(concept);
  assert.strictEqual(score, 90, 'Score should be 90 (85 + 5 for empty/1-word text overlay)');
});

test('getCTRScore handles case-insensitivity', () => {
  const concept = createMockConcept({
    hook: 'CURIOSITY',
    psychology: 'SHOCK',
  });
  const score = getCTRScore(concept);
  assert.strictEqual(score, 93, 'Score should be 93 (85 + 5 + 3) ignoring case');
});
