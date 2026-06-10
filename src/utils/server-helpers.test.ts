import test from 'node:test';
import assert from 'node:assert';
import { getMimeType, sanitizeError } from './server-helpers.js';

test('getMimeType', () => {
  assert.strictEqual(getMimeType('data:image/jpeg;base64,123'), 'image/jpeg');
  assert.strictEqual(getMimeType('data:image/png;base64,123'), 'image/png');
  assert.strictEqual(getMimeType('invalid-data'), 'image/png');
});

test('sanitizeError', () => {
  assert.strictEqual(sanitizeError(new Error('Normal error message')), 'Normal error message');

  assert.strictEqual(sanitizeError('String error message'), 'String error message');

  assert.strictEqual(sanitizeError({ message: 'Object error message' }), 'Object error message');

  assert.strictEqual(sanitizeError(null), 'Unknown error');
  assert.strictEqual(sanitizeError(undefined), 'Unknown error');

  const resourceExhaustedMsg = 'Error RESOURCE_EXHAUSTED some context';
  assert.strictEqual(sanitizeError(new Error(resourceExhaustedMsg)), 'Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com.');

  const spendingCapMsg = 'API request failed due to spending cap';
  assert.strictEqual(sanitizeError(new Error(spendingCapMsg)), 'Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com.');

  const invalidKeyMsg = 'API_KEY_INVALID';
  assert.strictEqual(sanitizeError(new Error(invalidKeyMsg)), 'Invalid API key. Please check your environment configuration.');

  const missingMinimaxMsg = 'MINIMAX_API_KEY environment variable is required';
  assert.strictEqual(sanitizeError(new Error(missingMinimaxMsg)), 'Image generation is not configured. MINIMAX_API_KEY is missing.');

  const urlMsg = 'Error from https://example.com/api';
  assert.strictEqual(sanitizeError(new Error(urlMsg)), 'Error from [url]');

  const multilineMsg = 'First line\nSecond line';
  assert.strictEqual(sanitizeError(new Error(multilineMsg)), 'First line');
});
