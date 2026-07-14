import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  let originalLocalStorage: Storage;

  beforeEach(() => {
    // Save original if it exists
    originalLocalStorage = (global as any).localStorage;

    // Create mock localStorage
    const mockStorage = {
      getItem: test.mock.fn((key: string) => null),
      setItem: test.mock.fn((key: string, value: string) => {}),
      removeItem: test.mock.fn((key: string) => {}),
    };

    (global as any).localStorage = mockStorage;
  });

  afterEach(() => {
    // Restore original
    if (originalLocalStorage === undefined) {
      delete (global as any).localStorage;
    } else {
      (global as any).localStorage = originalLocalStorage;
    }
    test.mock.restoreAll();
  });

  test('getItem returns null if localStorage throws', () => {
    (global as any).localStorage.getItem.mock.mockImplementation(() => {
      throw new Error('Access denied');
    });

    const result = safeStorage.getItem('test-key');
    assert.strictEqual(result, null);
  });

  test('getItem returns value if localStorage succeeds', () => {
    (global as any).localStorage.getItem.mock.mockImplementation(() => 'test-value');

    const result = safeStorage.getItem('test-key');
    assert.strictEqual(result, 'test-value');
  });

  test('setItem catches errors silently', () => {
    (global as any).localStorage.setItem.mock.mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    assert.doesNotThrow(() => {
      safeStorage.setItem('test-key', 'test-value');
    });
  });

  test('removeItem catches errors silently', () => {
    (global as any).localStorage.removeItem.mock.mockImplementation(() => {
      throw new Error('Access denied');
    });

    assert.doesNotThrow(() => {
      safeStorage.removeItem('test-key');
    });
  });
});
