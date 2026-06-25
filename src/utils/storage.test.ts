import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage methods', async (t) => {
  const store: Record<string, string> = {};

  (global as any).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };

  await t.test('setItem and getItem work correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
  });

  await t.test('removeItem works correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });
});
