import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('base score is 85', () => {
  const concept = { hook: '', psychology: '', text_overlay: '1 2 3 4 5' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 85);
});

test('adds 5 for curiosity hook', () => {
  const concept = { hook: 'curiosity gap', psychology: '', text_overlay: '1 2 3 4 5' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('adds 3 for shock psychology', () => {
  const concept = { hook: '', psychology: 'shocking reveal', text_overlay: '1 2 3 4 5' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 88);
});

test('adds 5 for short text overlay', () => {
  const concept = { hook: '', psychology: '', text_overlay: 'short text' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('max score is 99', () => {
  const concept = { hook: 'curiosity', psychology: 'shock', text_overlay: 'short text' } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 98);
});

test('handles missing properties gracefully', () => {
  const concept = {} as ThumbnailConcept;
  // Missing text_overlay means split is not called, so length condition is skipped
  // Due to optional chaining in scoring.ts, this should return 85
  assert.strictEqual(getCTRScore(concept), 85);
});
