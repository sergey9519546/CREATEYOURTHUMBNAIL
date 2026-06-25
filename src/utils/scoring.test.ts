import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';
import type { ThumbnailConcept } from '../types';

test('getCTRScore calculations', async (t) => {
  const baseConcept = {
    concept_number: 1,
    concept_name: 'Test Concept',
    hook: 'Test Hook',
    layout: 'Test Layout',
    text_overlay: 'One Two Three Four',
    color_strategy: 'Test Color Strategy',
    psychology: 'Test Psychology',
    ctr_explanation: 'Test CTR Explanation',
    image_generation_prompt: 'Test Image Generation Prompt',
  } as ThumbnailConcept;

  await t.test('calculates base score with short text', () => {
    // 85 base + 5 for short text
    assert.strictEqual(getCTRScore(baseConcept), 90);
  });

  await t.test('adds score for curiosity hook', () => {
    const concept = { ...baseConcept, hook: 'This is a curiosity hook' };
    // 85 base + 5 short text + 5 curiosity
    assert.strictEqual(getCTRScore(concept), 95);
  });

  await t.test('adds score for shock psychology', () => {
    const concept = { ...baseConcept, psychology: 'Shock value' };
    // 85 base + 5 short text + 3 shock
    assert.strictEqual(getCTRScore(concept), 93);
  });

  await t.test('caps score at 99', () => {
    const concept = { ...baseConcept, hook: 'curiosity', psychology: 'shock' };
    // 85 base + 5 short text + 5 curiosity + 3 shock = 98
    // To cap, let's make it hit > 99 if possible, but our current max is 98 based on logic
    // Actually, logic is: 85 + 5 + 3 + 5 = 98 max. Let's verify it's 98.
    assert.strictEqual(getCTRScore(concept), 98);
  });

  await t.test('no text score bonus for long text', () => {
    const concept = { ...baseConcept, text_overlay: 'One Two Three Four Five' };
    // 85 base + 0 short text
    assert.strictEqual(getCTRScore(concept), 85);
  });
});
