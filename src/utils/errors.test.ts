import { test } from 'node:test';
import assert from 'node:assert';
import { isQuotaError, sanitizeError, ERR_QUOTA_EXCEEDED, ERR_INVALID_API_KEY, ERR_MINIMAX_MISSING } from './errors';

test('isQuotaError identifies quota errors correctly', () => {
  assert.strictEqual(isQuotaError('RESOURCE_EXHAUSTED'), true);
  assert.strictEqual(isQuotaError('spending cap reached'), true);
  assert.strictEqual(isQuotaError('Gemini API Quota Exceeded'), true);
  assert.strictEqual(isQuotaError('Something else'), false);
  assert.strictEqual(isQuotaError(''), false);
});

test('sanitizeError scrubs API errors', () => {
  assert.strictEqual(sanitizeError({ message: 'RESOURCE_EXHAUSTED here' }), ERR_QUOTA_EXCEEDED);
  assert.strictEqual(sanitizeError({ message: 'API key not valid for this project' }), ERR_INVALID_API_KEY);
  assert.strictEqual(sanitizeError({ message: 'Missing MINIMAX_API_KEY environment variable' }), ERR_MINIMAX_MISSING);

  // URL scrubbing
  const output = sanitizeError({ message: 'Check https://some-url.com for info' });
  assert.ok(!output.includes('https://some-url.com'));
  assert.ok(output.includes('[url]'));
});
