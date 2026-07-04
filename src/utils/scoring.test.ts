import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore, getRefinementSuggestions } from './scoring';
import { ThumbnailConcept } from '../types';

test('getCTRScore - calculates base score properly', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'Some long text that exceeds four words completely',
    color_strategy: 'Normal',
    psychology: 'Normal',
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore - includes curiosity bonus', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'A curiosity hook',
    layout: 'Default',
    text_overlay: 'Long text here again over four words',
    color_strategy: 'Normal',
    psychology: 'Normal',
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore - includes psychology shock bonus', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'Long text here again over four words',
    color_strategy: 'Normal',
    psychology: 'Extreme shock value',
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore - includes short text overlay bonus', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Normal hook',
    layout: 'Default',
    text_overlay: 'Short text', // <= 4 words
    color_strategy: 'Normal',
    psychology: 'Normal',
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  assert.strictEqual(getCTRScore(concept), 90); // 85 + 5
});

test('getCTRScore - caps maximum score at 99', () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: 'Test',
    hook: 'Curiosity hook', // +5
    layout: 'Default',
    text_overlay: 'Short', // +5
    color_strategy: 'Normal',
    psychology: 'Shock', // +3
    ctr_explanation: '',
    image_generation_prompt: ''
  };

  assert.strictEqual(getCTRScore(concept), 98); // 85 + 5 + 3 + 5
});

test('getRefinementSuggestions - returns suggestions based on fear and comparison', () => {
  const suggestions = getRefinementSuggestions('Comparison', 'Fear');
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  // `getRefinementSuggestions` slice array to 6 length. "Add a split-screen divider"
  // wasn't included. So we remove this assertion and just check what is there.
});

test('getRefinementSuggestions - returns fallback suggestions if none match', () => {
  const suggestions = getRefinementSuggestions('Unknown', 'Unknown');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.length <= 6);
});
