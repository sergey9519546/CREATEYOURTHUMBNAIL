import test from 'node:test';
import assert from 'node:assert';
import { sanitizeError } from './error.js';

test('sanitizeError generic error string', () => {
  const err = new Error('Something went wrong');
  assert.strictEqual(sanitizeError(err), 'Something went wrong');
});

test('sanitizeError spending cap', () => {
  const err = new Error('The request failed: RESOURCE_EXHAUSTED');
  assert.strictEqual(
    sanitizeError(err),
    'Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com.'
  );
});

test('sanitizeError invalid API key', () => {
  const err = new Error('API key not valid');
  assert.strictEqual(
    sanitizeError(err),
    'Invalid API key. Please check your environment configuration.'
  );
});

test('sanitizeError minimax missing', () => {
  const err = new Error('Missing MINIMAX_API_KEY environment variable');
  assert.strictEqual(
    sanitizeError(err),
    'Image generation is not configured. MINIMAX_API_KEY is missing.'
  );
});

test('sanitizeError URL stripping', () => {
  const err = new Error('Failed to fetch https://example.com/api/data');
  assert.strictEqual(sanitizeError(err), 'Failed to fetch [url]');
});

test('sanitizeError string primitive', () => {
  const err = 'Just a string error';
  assert.strictEqual(sanitizeError(err), 'Just a string error');
});

test('sanitizeError object with message property', () => {
  const err = { message: 'Object error' };
  assert.strictEqual(sanitizeError(err), 'Object error');
});

test('sanitizeError unknown fallback', () => {
  assert.strictEqual(sanitizeError(null), 'Unknown error');
  assert.strictEqual(sanitizeError(undefined), 'Unknown error');
  assert.strictEqual(sanitizeError({}), 'Unknown error');
});

test('sanitizeError multiline truncation', () => {
  const err = new Error('First line\nSecond line\nThird line');
  assert.strictEqual(sanitizeError(err), 'First line');
});
