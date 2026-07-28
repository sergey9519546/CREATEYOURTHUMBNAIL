import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    (global as any).window = {
      localStorage: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
        removeItem: (key: string) => { delete mockStorage[key]; }
      }
    };
  });

  afterEach(() => {
    delete (global as any).window;
  });

  test('setItem and getItem should work correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    const result = safeStorage.getItem('test_key');
    assert.strictEqual(result, 'test_value');
  });

  test('getItem should return null for missing key', () => {
    const result = safeStorage.getItem('nonexistent_key');
    assert.strictEqual(result, null);
  });

  test('removeItem should work correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    safeStorage.removeItem('test_key');
    const result = safeStorage.getItem('test_key');
    assert.strictEqual(result, null);
  });

  test('should handle getItem errors gracefully and return null', () => {
    (global as any).window.localStorage.getItem = () => { throw new Error('QuotaExceededError'); };
    const result = safeStorage.getItem('test_key');
    assert.strictEqual(result, null);
  });

  test('should handle setItem errors gracefully', () => {
    (global as any).window.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    assert.doesNotThrow(() => {
      safeStorage.setItem('test_key', 'test_value');
    });
  });

  test('should handle removeItem errors gracefully', () => {
    (global as any).window.localStorage.removeItem = () => { throw new Error('SecurityError'); };
    assert.doesNotThrow(() => {
      safeStorage.removeItem('test_key');
    });
  });
});
