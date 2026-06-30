import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring';

describe('getCTRScore', () => {
  test('calculates base score correctly', () => {
    const concept = { hook: 'normal', psychology: 'normal', text_overlay: 'one two three four five' } as any;
    assert.strictEqual(getCTRScore(concept), 85);
  });
  test('adds points for curiosity and shock', () => {
    const concept = { hook: 'curiosity', psychology: 'shock', text_overlay: 'one two three four five' } as any;
    assert.strictEqual(getCTRScore(concept), 93);
  });
  test('caps score at 99', () => {
    const concept = { hook: 'curiosity', psychology: 'shock', text_overlay: 'short text' } as any;
    assert.strictEqual(getCTRScore(concept), 98);
  });
});
