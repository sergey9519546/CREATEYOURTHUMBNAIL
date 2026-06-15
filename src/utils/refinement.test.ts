import test from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions', async (t) => {
  await t.test('returns curiosity/number suggestions', () => {
    const suggestions = getRefinementSuggestions('number hook', 'curiosity psychology');
    assert.ok(suggestions.some(s => s.includes('glow')));
  });

  await t.test('returns default suggestions when no match', () => {
    const suggestions = getRefinementSuggestions('generic hook', 'generic psychology');
    assert.strictEqual(suggestions.length, 5);
    assert.ok(suggestions.some(s => s.includes('contrast')));
  });
});
