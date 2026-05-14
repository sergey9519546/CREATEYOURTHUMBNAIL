import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getRefinementSuggestions } from './refinement.js';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('number', 'curiosity');
  assert.equal(suggestions.includes("Make the number glow to increase focus"), true);
  assert.equal(suggestions.includes("Use a '?' instead of a digit to amplify mystery"), true);
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('comparison', 'fear');
  assert.equal(suggestions.includes("Make the 'bad' side darker to increase contrast"), true);
  assert.equal(suggestions.includes("Add a warning sign to the 'bad' side"), true);
});

test('getRefinementSuggestions - joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('storytelling', 'joy');
  assert.equal(suggestions.includes("Add a bright, happy background"), true);
  assert.equal(suggestions.includes("Make the subject's expression more ecstatic"), true);
});

test('getRefinementSuggestions - controversy', () => {
  const suggestions = getRefinementSuggestions('anything', 'controversy');
  assert.equal(suggestions.includes("Use a more confrontational pose"), true);
  assert.equal(suggestions.includes("Add a 'vs' element"), true);
});

test('getRefinementSuggestions - default fallback when no matches', () => {
  const suggestions = getRefinementSuggestions('generic hook', 'generic psychology');
  assert.equal(suggestions.includes("Increase text size for mobile readability"), true);
  assert.equal(suggestions.includes("Boost subject brightness by 20%"), true);
});
