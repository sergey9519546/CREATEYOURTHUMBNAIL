import { test } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

test('safeStorage methods handle missing global.localStorage gracefully', () => {
  const originalLocalStorage = (global as any).localStorage;
  (global as any).localStorage = undefined;

  assert.strictEqual(safeStorage.getItem('test_key'), null);

  assert.doesNotThrow(() => {
    safeStorage.setItem('test_key', 'test_value');
    safeStorage.removeItem('test_key');
  });

  (global as any).localStorage = originalLocalStorage;
});

test('safeStorage works with mocked localStorage', () => {
  const store = new Map<string, string>();
  const originalLocalStorage = (global as any).localStorage;

  (global as any).localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  };

  safeStorage.setItem('key1', 'value1');
  assert.strictEqual(safeStorage.getItem('key1'), 'value1');
  safeStorage.removeItem('key1');
  assert.strictEqual(safeStorage.getItem('key1'), null);

  (global as any).localStorage = originalLocalStorage;
});
