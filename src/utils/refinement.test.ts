import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions, getCTRScore } from './refinement.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getRefinementSuggestions - curiosity and mystery', () => {
  const suggestions = getRefinementSuggestions('What happens next', 'curiosity');
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
});

test('getRefinementSuggestions - fallback', () => {
  const suggestions = getRefinementSuggestions('Normal hook', 'Normal psychology');
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getCTRScore - curiosity', () => {
  const concept = { hook: 'curiosity hook', psychology: 'normal', text_overlay: 'long text overlay here please' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore - shock and short text', () => {
  const concept = { hook: 'normal hook', psychology: 'shock', text_overlay: 'short text' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 93);
});
