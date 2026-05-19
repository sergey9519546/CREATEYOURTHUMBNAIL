import { test } from 'node:test';
import assert from 'node:assert';
import { getRefinementSuggestions } from './refinement';

test('getRefinementSuggestions - curiosity and number', () => {
  const suggestions = getRefinementSuggestions('a number of ways to win', 'curiosity');
  assert.ok(suggestions.some(s => s.includes('Make the number glow')));
  assert.ok(suggestions.some(s => s.includes("Add a '?' to the text")));
  assert.ok(suggestions.length <= 6);
});

test('getRefinementSuggestions - fear and comparison', () => {
  const suggestions = getRefinementSuggestions('before vs after comparison', 'fear');
  assert.ok(suggestions.some(s => s.includes("Make the 'bad' side darker")));
  assert.ok(suggestions.some(s => s.includes("Add a warning sign to the 'bad' side")));
  assert.ok(suggestions.some(s => s.includes("Add a red border")));
  assert.ok(suggestions.length <= 6);
});

test('getRefinementSuggestions - joy and storytelling', () => {
  const suggestions = getRefinementSuggestions('a happy storytelling moment', 'joy');
  assert.ok(suggestions.some(s => s.includes("bright, happy background")));
  assert.ok(suggestions.some(s => s.includes("Increase color saturation to 100%")));
  assert.ok(suggestions.some(s => s.includes("narrative element to the background")));
  assert.ok(suggestions.length <= 6);
});

test('getRefinementSuggestions - controversy', () => {
  const suggestions = getRefinementSuggestions('this is a test', 'controversy');
  assert.ok(suggestions.some(s => s.includes("more confrontational pose")));
  assert.ok(suggestions.length <= 6);
});

test('getRefinementSuggestions - authority', () => {
  const suggestions = getRefinementSuggestions('expert advice', 'calm');
  assert.ok(suggestions.some(s => s.includes("professional badge")));
  assert.ok(suggestions.length <= 6);
});

test('getRefinementSuggestions - listicle', () => {
  const suggestions = getRefinementSuggestions('top 10 listicle', 'calm');
  assert.ok(suggestions.some(s => s.includes("number badge for scannability")));
  assert.ok(suggestions.length <= 6);
});

test('getRefinementSuggestions - empty state fallbacks', () => {
  const suggestions = getRefinementSuggestions('nothing', 'nothing');
  assert.ok(suggestions.some(s => s.includes("Increase text size")));
  assert.ok(suggestions.some(s => s.includes("Boost subject brightness")));
  assert.ok(suggestions.length <= 6);
});
