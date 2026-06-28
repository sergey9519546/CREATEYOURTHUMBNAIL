import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage works correctly when localStorage is available', () => {
  const store = new Map<string, string>();
  const mockLocalStorage = {
    getItem: (key: string) => store.has(key) ? store.get(key)! : null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key)
  };
  (global as any).localStorage = mockLocalStorage;

  safeStorage.setItem('test_key', 'test_value');
  assert.strictEqual(store.get('test_key'), 'test_value');
  assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');

  safeStorage.removeItem('test_key');
  assert.strictEqual(store.has('test_key'), false);
  assert.strictEqual(safeStorage.getItem('test_key'), null);
});

test('safeStorage handles localStorage exceptions gracefully', () => {
  const mockLocalStorage = {
    getItem: () => { throw new Error('Quota exceeded'); },
    setItem: () => { throw new Error('Quota exceeded'); },
    removeItem: () => { throw new Error('Quota exceeded'); }
  };
  (global as any).localStorage = mockLocalStorage;

  // The following should not throw
  assert.doesNotThrow(() => safeStorage.setItem('test_key', 'test_value'));
  assert.strictEqual(safeStorage.getItem('test_key'), null);
  assert.doesNotThrow(() => safeStorage.removeItem('test_key'));
});
