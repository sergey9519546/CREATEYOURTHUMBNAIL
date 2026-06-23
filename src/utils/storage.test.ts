import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

test('safeStorage methods handle basic operations', () => {
  const store = new Map<string, string>();

  (global as any).localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => store.set(key, val),
    removeItem: (key: string) => store.delete(key),
  };

  safeStorage.setItem('test_key', 'test_value');
  assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');

  safeStorage.removeItem('test_key');
  assert.strictEqual(safeStorage.getItem('test_key'), null);
});

test('safeStorage catches exception from localStorage', (t) => {
  // Mock localStorage throwing error (e.g. quota exceeded)
  (global as any).localStorage = {
    getItem: () => { throw new Error('Quota exceeded'); },
    setItem: () => { throw new Error('Quota exceeded'); },
    removeItem: () => { throw new Error('Quota exceeded'); },
  };

  // Mock console.warn to suppress it in test output
  const originalWarn = console.warn;
  let warnCalled = false;
  console.warn = () => { warnCalled = true; };

  assert.doesNotThrow(() => safeStorage.setItem('key', 'val'));
  assert.strictEqual(safeStorage.getItem('key'), null);
  assert.doesNotThrow(() => safeStorage.removeItem('key'));

  assert.ok(warnCalled, 'console.warn should have been called when error was caught');

  // restore console.warn
  console.warn = originalWarn;
});
