import test from 'node:test';
import assert from 'node:assert';
import { getCTRScore } from './scoring.js';

test('getCTRScore', async (t) => {
  await t.test('calculates base score correctly', () => {
    const score = getCTRScore({ hook: 'normal', psychology: 'normal', text_overlay: 'one two three four five' });
    assert.strictEqual(score, 85);
  });

  await t.test('adds points for curiosity hook', () => {
    const score = getCTRScore({ hook: 'This is a curiosity gap', psychology: 'normal', text_overlay: 'one two three four five' });
    assert.strictEqual(score, 90);
  });

  await t.test('adds points for shock psychology', () => {
    const score = getCTRScore({ hook: 'normal', psychology: 'Shock value', text_overlay: 'one two three four five' });
    assert.strictEqual(score, 88);
  });

  await t.test('adds points for short text overlay', () => {
    const score = getCTRScore({ hook: 'normal', psychology: 'normal', text_overlay: 'short text here' });
    assert.strictEqual(score, 90);
  });

  await t.test('max score is capped at 99', () => {
    const score = getCTRScore({ hook: 'curiosity', psychology: 'shock', text_overlay: 'short text' });
    assert.strictEqual(score, 98);
  });
});
