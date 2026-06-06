import { test } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './ctr.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore calculates correct score', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test Concept',
    hook: 'Curiosity',
    layout: 'Split',
    text_overlay: 'One Two Three',
    color_strategy: 'Vibrant',
    psychology: 'Shock',
    ctr_explanation: 'Testing',
    image_generation_prompt: 'Test prompt',
  };

  // Base 85 + 5 (curiosity) + 3 (shock) + 5 (<= 4 words) = 98
  assert.strictEqual(getCTRScore(concept), 98);
});
