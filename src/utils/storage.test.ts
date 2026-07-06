import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    mockStorage = {};
    (global as any).localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value; },
      removeItem: (key: string) => { delete mockStorage[key]; }
    };
  });

  afterEach(() => {
    delete (global as any).localStorage;
  });

  test('getItem returns value if it exists', () => {
    mockStorage['testKey'] = 'testValue';
    assert.strictEqual(safeStorage.getItem('testKey'), 'testValue');
  });

  test('getItem returns null if key does not exist', () => {
    assert.strictEqual(safeStorage.getItem('nonExistentKey'), null);
  });

  test('setItem saves value', () => {
    safeStorage.setItem('testKey', 'testValue');
    assert.strictEqual(mockStorage['testKey'], 'testValue');
  });

  test('removeItem deletes value', () => {
    mockStorage['testKey'] = 'testValue';
    safeStorage.removeItem('testKey');
    assert.strictEqual(mockStorage['testKey'], undefined);
  });

  test('getItem safely catches and returns null on throw', () => {
    (global as any).localStorage.getItem = () => { throw new Error('QuotaExceededError'); };
    assert.strictEqual(safeStorage.getItem('testKey'), null);
  });

  test('setItem safely catches on throw', () => {
    (global as any).localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    // Should not throw
    assert.doesNotThrow(() => {
      safeStorage.setItem('testKey', 'testValue');
    });
  });

  test('removeItem safely catches on throw', () => {
    (global as any).localStorage.removeItem = () => { throw new Error('QuotaExceededError'); };
    // Should not throw
    assert.doesNotThrow(() => {
      safeStorage.removeItem('testKey');
    });
  });
});
