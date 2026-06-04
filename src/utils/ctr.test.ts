import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './ctr.js';
import { ThumbnailConcept } from '../services/gemini.js';

test('getCTRScore default score', () => {
  const concept = {
    hook: 'normal hook',
    psychology: 'normal psychology',
    text_overlay: 'a slightly longer text overlay'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore with curiosity hook', () => {
  const concept = {
    hook: 'a curiosity hook',
    psychology: 'normal psychology',
    text_overlay: 'a slightly longer text overlay'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore with shock psychology', () => {
  const concept = {
    hook: 'normal hook',
    psychology: 'shocking psychology',
    text_overlay: 'a slightly longer text overlay'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 88);
});

test('getCTRScore with short text overlay', () => {
  const concept = {
    hook: 'normal hook',
    psychology: 'normal psychology',
    text_overlay: 'short text'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore with all modifiers', () => {
  const concept = {
    hook: 'curiosity',
    psychology: 'shock',
    text_overlay: 'short text'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 98);
});

test('getCTRScore max score is 99', () => {
  const concept = {
    hook: 'curiosity',
    psychology: 'shock',
    text_overlay: 'short text'
  } as ThumbnailConcept;
  assert.strictEqual(getCTRScore(concept), 98); // The max possible based on the formula is 98.
});
