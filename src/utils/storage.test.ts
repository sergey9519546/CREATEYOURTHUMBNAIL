import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    const mockLocalStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value; },
      removeItem: (key: string) => { delete mockStorage[key]; }
    };
    (global as any).localStorage = mockLocalStorage;
  });

  afterEach(() => {
    delete (global as any).localStorage;
  });

  test('getItem retrieves a value', () => {
    mockStorage['testKey'] = 'testValue';
    assert.strictEqual(safeStorage.getItem('testKey'), 'testValue');
  });

  test('getItem returns null for missing key', () => {
    assert.strictEqual(safeStorage.getItem('missingKey'), null);
  });

  test('setItem stores a value', () => {
    safeStorage.setItem('testKey', 'testValue');
    assert.strictEqual(mockStorage['testKey'], 'testValue');
  });

  test('removeItem deletes a value', () => {
    mockStorage['testKey'] = 'testValue';
    safeStorage.removeItem('testKey');
    assert.strictEqual(mockStorage['testKey'], undefined);
  });

  test('getItem handles exceptions gracefully', () => {
    (global as any).localStorage = {
      getItem: () => { throw new Error('QuotaExceededError'); }
    };
    assert.strictEqual(safeStorage.getItem('testKey'), null);
  });

  test('setItem handles exceptions gracefully', () => {
    (global as any).localStorage = {
      setItem: () => { throw new Error('QuotaExceededError'); }
    };
    assert.doesNotThrow(() => {
      safeStorage.setItem('testKey', 'testValue');
    });
  });

  test('removeItem handles exceptions gracefully', () => {
    (global as any).localStorage = {
      removeItem: () => { throw new Error('QuotaExceededError'); }
    };
    assert.doesNotThrow(() => {
      safeStorage.removeItem('testKey');
    });
  });
});
