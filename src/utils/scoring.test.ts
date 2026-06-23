import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore, getRefinementSuggestions } from './scoring.js';
import { ThumbnailConcept } from '../types.js';

test('getCTRScore calculates correct score', () => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'test',
    hook: '',
    layout: '',
    text_overlay: 'One Two Three Four',
    color_strategy: '',
    psychology: '',
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  // Base score 85 + 5 for short text = 90
  assert.strictEqual(getCTRScore(baseConcept), 90);

  // Curiosity +5, Shock +3 = 98
  const strongConcept = { ...baseConcept, hook: 'Curiosity Gap', psychology: 'Shock Value' };
  assert.strictEqual(getCTRScore(strongConcept), 98);
});

test('getRefinementSuggestions returns fallback when no match', () => {
  const suggestions = getRefinementSuggestions('basic', 'basic');
  assert.strictEqual(suggestions.length, 5);
  assert.strictEqual(suggestions[0], "Increase text size for mobile readability");
});

test('getRefinementSuggestions matches curiosity psychology', () => {
  const suggestions = getRefinementSuggestions('basic', 'curiosity');
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
});
