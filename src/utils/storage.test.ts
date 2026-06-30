import { test, describe } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  test('handles missing localStorage gracefully', () => {
    // Since localStorage is not defined in this node test environment, it will throw, which safeStorage should catch
    const result = safeStorage.getItem('test_key');
    assert.strictEqual(result, null);
  });
});
