import { test } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

test('safeStorage handles missing or inaccessible localStorage gracefully', () => {
  // Simulate an environment where localStorage throws (e.g. strict privacy mode)
  const originalLocalStorage = global.localStorage;

  (global as any).localStorage = {
    getItem: () => { throw new Error('Access denied'); },
    setItem: () => { throw new Error('Access denied'); },
    removeItem: () => { throw new Error('Access denied'); }
  };

  // Should not throw, should return null for getItem
  assert.strictEqual(safeStorage.getItem('test'), null);

  // Should not throw
  assert.doesNotThrow(() => safeStorage.setItem('test', 'value'));
  assert.doesNotThrow(() => safeStorage.removeItem('test'));

  // Restore original
  global.localStorage = originalLocalStorage;
});

test('safeStorage works correctly when localStorage is available', () => {
  const store = new Map();
  const originalLocalStorage = global.localStorage;

  (global as any).localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key)
  };

  safeStorage.setItem('test_key', 'test_value');
  assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');

  safeStorage.removeItem('test_key');
  assert.strictEqual(safeStorage.getItem('test_key'), null);

  global.localStorage = originalLocalStorage;
});
