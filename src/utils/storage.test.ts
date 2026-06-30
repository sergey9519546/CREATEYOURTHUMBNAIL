import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  let mockStorage: any;
  before(() => {
    mockStorage = {};
    (global as any).localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value; },
      removeItem: (key: string) => { delete mockStorage[key]; }
    };
  });

  test('setItem and getItem work correctly', () => {
    safeStorage.setItem('testKey', 'testValue');
    assert.strictEqual(safeStorage.getItem('testKey'), 'testValue');
  });

  test('removeItem works correctly', () => {
    safeStorage.setItem('testKey2', 'testValue2');
    safeStorage.removeItem('testKey2');
    assert.strictEqual(safeStorage.getItem('testKey2'), null);
  });

  test('handles errors gracefully', () => {
    (global as any).localStorage.setItem = () => { throw new Error('Quota exceeded'); };
    assert.doesNotThrow(() => safeStorage.setItem('failKey', 'failValue'));
  });
});
