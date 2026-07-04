import test from 'node:test';
import assert from 'node:assert';
import { isQuotaError, isAuthError } from './errors';

test('isQuotaError', async (t) => {
  await t.test('detects quota errors', () => {
    assert.strictEqual(isQuotaError('RESOURCE_EXHAUSTED'), true);
    assert.strictEqual(isQuotaError('You reached your spending cap limit'), true);
    assert.strictEqual(isQuotaError('Quota Exceeded'), true);
  });

  await t.test('ignores other errors', () => {
    assert.strictEqual(isQuotaError('Internal Server Error'), false);
    assert.strictEqual(isQuotaError(''), false);
  });
});

test('isAuthError', async (t) => {
  await t.test('detects auth errors', () => {
    assert.strictEqual(isAuthError('API_KEY_INVALID'), true);
    assert.strictEqual(isAuthError('Key is not valid'), true);
    assert.strictEqual(isAuthError('Missing API key'), true);
  });

  await t.test('ignores other errors', () => {
    assert.strictEqual(isAuthError('Internal Server Error'), false);
    assert.strictEqual(isAuthError(''), false);
  });
});
