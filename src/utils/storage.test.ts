import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage', async (t) => {
  let mockStorage: Record<string, string> = {};

  (global as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; }
  };

  t.afterEach(() => {
    mockStorage = {};
  });

  await t.test('setItem and getItem work normally', () => {
    safeStorage.setItem('test_key', 'test_val');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_val');
  });

  await t.test('removeItem works normally', () => {
    safeStorage.setItem('test_key', 'test_val');
    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  await t.test('getItem handles exceptions gracefully', () => {
    (global as any).localStorage.getItem = () => { throw new Error('QuotaExceededError'); };
    const val = safeStorage.getItem('test_key');
    assert.strictEqual(val, null);
  });

  await t.test('setItem handles exceptions gracefully without throwing', () => {
    (global as any).localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    assert.doesNotThrow(() => {
      safeStorage.setItem('test_key', 'test_val');
    });
  });
});
