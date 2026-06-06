import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './ctr.js';

test('getCTRScore default score is 85', () => {
  const concept = { hook: '', psychology: '', text_overlay: '1 2 3 4 5' } as any;
  assert.strictEqual(getCTRScore(concept), 85);
});

test('getCTRScore adds for curiosity', () => {
  const concept = { hook: 'curiosity', psychology: '', text_overlay: '1 2 3 4 5' } as any;
  assert.strictEqual(getCTRScore(concept), 90);
});

test('getCTRScore handles missing fields', () => {
  const concept = {} as any;
  assert.strictEqual(getCTRScore(concept), 85);
});
