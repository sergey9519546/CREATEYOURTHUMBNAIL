import test, { describe } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

describe('safeStorage', () => {
  test('getItem returns value when successful', () => {
    const mockLocalStorage = {
      getItem: (key: string) => {
        if (key === 'test') return 'value';
        return null;
      },
      setItem: () => {},
      removeItem: () => {}
    };
    global.localStorage = mockLocalStorage as any;

    const result = safeStorage.getItem('test');
    assert.strictEqual(result, 'value');
  });

  test('getItem returns null on throw', () => {
    const mockLocalStorage = {
      getItem: () => { throw new Error('Quota Exceeded'); },
      setItem: () => {},
      removeItem: () => {}
    };
    global.localStorage = mockLocalStorage as any;

    const result = safeStorage.getItem('test');
    assert.strictEqual(result, null);
  });

  test('setItem suppresses throw', () => {
    const mockLocalStorage = {
      getItem: () => null,
      setItem: () => { throw new Error('Quota Exceeded'); },
      removeItem: () => {}
    };
    global.localStorage = mockLocalStorage as any;

    // Should not throw
    safeStorage.setItem('test', 'value');
  });

  test('removeItem suppresses throw', () => {
    const mockLocalStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => { throw new Error('Access Denied'); }
    };
    global.localStorage = mockLocalStorage as any;

    // Should not throw
    safeStorage.removeItem('test');
  });
});
