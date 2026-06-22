import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

test('safeStorage wrapper', async (t) => {
  // Mock localStorage in global scope since node doesn't have it natively
  let store: Record<string, string> = {};
  let throwError = false;

  (global as any).localStorage = {
    getItem: (key: string) => {
      if (throwError) throw new Error('QuotaExceededError');
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      if (throwError) throw new Error('QuotaExceededError');
      store[key] = value;
    },
    removeItem: (key: string) => {
      if (throwError) throw new Error('QuotaExceededError');
      delete store[key];
    }
  };

  await t.test('setItem and getItem work normally', () => {
    throwError = false;
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
  });

  await t.test('removeItem works normally', () => {
    throwError = false;
    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  await t.test('getItem catches errors and returns null safely', () => {
    throwError = true;
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  await t.test('setItem catches errors safely', () => {
    throwError = true;
    assert.doesNotThrow(() => safeStorage.setItem('test_key', 'test_value'));
  });

  await t.test('removeItem catches errors safely', () => {
    throwError = true;
    assert.doesNotThrow(() => safeStorage.removeItem('test_key'));
  });
});
