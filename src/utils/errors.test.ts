import { test } from 'node:test';
import assert from 'node:assert';
import { sanitizeError } from './errors';

test('sanitizeError correctly handles generic errors', () => {
  const err = new Error('Something went wrong');
  assert.strictEqual(sanitizeError(err), 'Something went wrong');
});

test('sanitizeError removes URLs', () => {
  const err = new Error('Failed to fetch from https://api.example.com/data');
  assert.strictEqual(sanitizeError(err), 'Failed to fetch from [url]');
});

test('sanitizeError keeps only the first line', () => {
  const err = new Error('Line 1\nLine 2\nLine 3');
  assert.strictEqual(sanitizeError(err), 'Line 1');
});

test('sanitizeError caps length at 300 characters', () => {
  const longMsg = 'A'.repeat(400);
  const err = new Error(longMsg);
  assert.strictEqual(sanitizeError(err).length, 300);
  assert.strictEqual(sanitizeError(err), 'A'.repeat(300));
});

test('sanitizeError handles Gemini quota exceeded', () => {
  const err1 = new Error('You reached your spending cap');
  assert.strictEqual(sanitizeError(err1), 'Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com.');

  const err2 = new Error('RESOURCE_EXHAUSTED: quota exceeded');
  assert.strictEqual(sanitizeError(err2), 'Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com.');
});

test('sanitizeError handles Invalid API key', () => {
  const err1 = new Error('API_KEY_INVALID');
  assert.strictEqual(sanitizeError(err1), 'Invalid API key. Please check your environment configuration.');

  const err2 = new Error('API key not valid');
  assert.strictEqual(sanitizeError(err2), 'Invalid API key. Please check your environment configuration.');
});

test('sanitizeError handles missing Minimax API key', () => {
  const err = new Error('MINIMAX_API_KEY environment variable is missing');
  assert.strictEqual(sanitizeError(err), 'Image generation is not configured. MINIMAX_API_KEY is missing.');
});

test('sanitizeError handles null/undefined error objects', () => {
  assert.strictEqual(sanitizeError(null), 'Unknown error');
  assert.strictEqual(sanitizeError(undefined), 'Unknown error');
  assert.strictEqual(sanitizeError({}), 'Unknown error');
});
