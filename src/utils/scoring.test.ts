import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore base score is 85', () => {
  const concept = {
    hook: 'Normal hook',
    psychology: 'Normal psychology',
    text_overlay: 'This is a long text overlay with many words'
  } as ThumbnailConcept;

  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore adds points for curiosity', () => {
  const concept = {
    hook: 'curiosity gap',
    psychology: 'Normal psychology',
    text_overlay: 'This is a long text overlay with many words'
  } as ThumbnailConcept;

  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore adds points for shock', () => {
  const concept = {
    hook: 'Normal hook',
    psychology: 'shock value',
    text_overlay: 'This is a long text overlay with many words'
  } as ThumbnailConcept;

  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore adds points for short text overlay', () => {
  const concept = {
    hook: 'Normal hook',
    psychology: 'Normal psychology',
    text_overlay: 'Short text here'
  } as ThumbnailConcept;

  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore combined maxes at 99', () => {
  const concept = {
    hook: 'curiosity',
    psychology: 'shock',
    text_overlay: 'short text'
  } as ThumbnailConcept;

  assert.strictEqual(getCTRScore(concept), 98);
});
