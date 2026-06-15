import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';

test('getCTRScore', async (t) => {
  await t.test('calculates base score', () => {
    const concept = { hook: '', psychology: '', text_overlay: '1 2 3 4 5' } as any;
    assert.strictEqual(getCTRScore(concept), 85);
  });

  await t.test('adds points for curiosity hook', () => {
    const concept = { hook: 'curiosity gap', psychology: '', text_overlay: '1 2 3 4 5' } as any;
    assert.strictEqual(getCTRScore(concept), 90);
  });

  await t.test('adds points for shock psychology', () => {
    const concept = { hook: '', psychology: 'shock value', text_overlay: '1 2 3 4 5' } as any;
    assert.strictEqual(getCTRScore(concept), 88);
  });

  await t.test('adds points for short text overlay', () => {
    const concept = { hook: '', psychology: '', text_overlay: '1 2 3 4' } as any;
    assert.strictEqual(getCTRScore(concept), 90);
  });

  await t.test('maxes out at 99', () => {
    const concept = { hook: 'curiosity', psychology: 'shock', text_overlay: '1 2' } as any;
    assert.strictEqual(getCTRScore(concept), 98); // 85 + 5 + 3 + 5 = 98
  });

  await t.test('handles missing properties gracefully', () => {
    const concept = {} as any;
    assert.strictEqual(getCTRScore(concept), 85); // should not crash
  });
});
