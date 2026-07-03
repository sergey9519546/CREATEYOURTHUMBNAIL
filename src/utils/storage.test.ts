import { test } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage methods handle non-browser environments gracefully', () => {
  // node test runner doesn't have window or localStorage by default
  assert.strictEqual(safeStorage.getItem('foo'), null);

  // These shouldn't throw
  safeStorage.setItem('foo', 'bar');
  safeStorage.removeItem('foo');
});

test('safeStorage methods catch and return gracefully if localStorage throws', (t) => {
  // mock window and localStorage throwing
  const originalWindow = global.window;
  (global as any).window = {};
  (global as any).localStorage = {
    getItem: () => { throw new Error('Quota exceeded'); },
    setItem: () => { throw new Error('Quota exceeded'); },
    removeItem: () => { throw new Error('Quota exceeded'); }
  };

  assert.strictEqual(safeStorage.getItem('foo'), null);

  // These shouldn't throw
  safeStorage.setItem('foo', 'bar');
  safeStorage.removeItem('foo');

  // restore
  global.window = originalWindow;
  delete (global as any).localStorage;
});
