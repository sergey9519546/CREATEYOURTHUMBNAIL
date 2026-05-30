import { test } from 'node:test';
import * as assert from 'node:assert';
import { sanitizeError } from './errorHandling.js';

test('sanitizeError: extracts message from Error object', () => {
  const err = new Error('Database connection failed');
  const result = sanitizeError(err);
  assert.strictEqual(result, 'Database connection failed');
});

test('sanitizeError: extracts message from string', () => {
  const result = sanitizeError('String error message');
  assert.strictEqual(result, 'String error message');
});

test('sanitizeError: extracts message from generic object', () => {
  const result = sanitizeError({ message: 'Object error message' });
  assert.strictEqual(result, 'Object error message');
});

test('sanitizeError: handles null or undefined safely', () => {
  assert.strictEqual(sanitizeError(null), 'Unknown error');
  assert.strictEqual(sanitizeError(undefined), 'Unknown error');
  assert.strictEqual(sanitizeError({}), 'Unknown error');
});

test('sanitizeError: handles Gemini quota error', () => {
  const err = new Error('failed: RESOURCE_EXHAUSTED something');
  const result = sanitizeError(err);
  assert.strictEqual(result, 'Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com.');
});

test('sanitizeError: handles Invalid API key error', () => {
  const err = new Error('API_KEY_INVALID: key is wrong');
  const result = sanitizeError(err);
  assert.strictEqual(result, 'Invalid API key. Please check your environment configuration.');
});

test('sanitizeError: handles missing Minimax API key error', () => {
  const err = new Error('Missing MINIMAX_API_KEY environment variable');
  const result = sanitizeError(err);
  assert.strictEqual(result, 'Image generation is not configured. MINIMAX_API_KEY is missing.');
});

test('sanitizeError: scrubs URLs from message', () => {
  const err = new Error('Failed to fetch from https://api.example.com/v1/data or http://test.com');
  const result = sanitizeError(err);
  assert.strictEqual(result, 'Failed to fetch from [url] or [url]');
});

test('sanitizeError: strips stack traces (keeps only first line)', () => {
  const err = new Error('Main error occurred\n  at something\n  at something else');
  const result = sanitizeError(err);
  assert.strictEqual(result, 'Main error occurred');
});

test('sanitizeError: caps length at 300 characters', () => {
  const longString = 'A'.repeat(500);
  const err = new Error(longString);
  const result = sanitizeError(err);
  assert.strictEqual(result.length, 300);
  assert.strictEqual(result, 'A'.repeat(300));
});
