import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
    const suggestions = getRefinementSuggestions('number hook', 'curiosity psychology');
    assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test('getRefinementSuggestions - fear and comparison', () => {
    const suggestions = getRefinementSuggestions('comparison hook', 'fear psychology');
    assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
});

test('getRefinementSuggestions - joy and storytelling', () => {
    const suggestions = getRefinementSuggestions('storytelling hook', 'joy psychology');
    assert.ok(suggestions.includes("Add a bright, happy background"));
});

test('getRefinementSuggestions - no specific matches', () => {
    const suggestions = getRefinementSuggestions('basic hook', 'basic psychology');
    assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test('getRefinementSuggestions - max 6 suggestions', () => {
    // Both fear, curiosity, joy add some suggestions if we just pass a string with lots of matches
    // Note: getRefinementSuggestions checks `includes`, so passing multiple words triggers multiple blocks.
    const suggestions = getRefinementSuggestions('number comparison storytelling versus listicle authority', 'curiosity fear joy mystery urgency excitement controversy');
    assert.strictEqual(suggestions.length, 6);
});
