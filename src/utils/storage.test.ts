import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  beforeEach(() => {
    const mockStorage = new Map<string, string>();
    (global as any).localStorage = {
      getItem: test.mock.fn((key: string) => mockStorage.get(key) || null),
      setItem: test.mock.fn((key: string, value: string) => mockStorage.set(key, value)),
      removeItem: test.mock.fn((key: string) => mockStorage.delete(key)),
    };
  });

  afterEach(() => {
    delete (global as any).localStorage;
    test.mock.restoreAll();
  });

  test('setItem and getItem work correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
  });

  test('removeItem works correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  test('getItem handles access exceptions gracefully', () => {
    (global as any).localStorage.getItem = test.mock.fn(() => { throw new Error('Access Denied'); });
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  test('setItem handles quota exceptions gracefully', () => {
    (global as any).localStorage.setItem = test.mock.fn(() => { throw new Error('Quota Exceeded'); });
    assert.doesNotThrow(() => safeStorage.setItem('test_key', 'test_value'));
  });

  test('removeItem handles access exceptions gracefully', () => {
    (global as any).localStorage.removeItem = test.mock.fn(() => { throw new Error('Access Denied'); });
    assert.doesNotThrow(() => safeStorage.removeItem('test_key'));
  });
});
