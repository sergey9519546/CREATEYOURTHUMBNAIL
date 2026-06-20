import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

test('safeStorage tests', async (t) => {
  // Save original global window and console.warn
  const originalWindow = global.window;
  const originalWarn = console.warn;
  let warnLogs: any[] = [];

  console.warn = (...args) => {
    warnLogs.push(args);
  };

  t.afterEach(() => {
    warnLogs = [];
  });

  await t.test('setItem and getItem work normally when localStorage is available', () => {
    const mockStorage = new Map<string, string>();
    (global as any).window = {
      localStorage: {
        getItem: (key: string) => mockStorage.has(key) ? mockStorage.get(key) : null,
        setItem: (key: string, value: string) => mockStorage.set(key, value),
        removeItem: (key: string) => mockStorage.delete(key),
      }
    };

    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');

    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
    assert.strictEqual(warnLogs.length, 0);
  });

  await t.test('getItem gracefully handles errors and logs warning', () => {
    (global as any).window = {
      localStorage: {
        getItem: () => { throw new Error('QuotaExceeded'); }
      }
    };

    const result = safeStorage.getItem('error_key');
    assert.strictEqual(result, null);
    assert.strictEqual(warnLogs.length, 1);
    assert.ok(warnLogs[0][0].includes('Failed to read from localStorage'));
  });

  await t.test('setItem gracefully handles errors and logs warning', () => {
    (global as any).window = {
      localStorage: {
        setItem: () => { throw new Error('QuotaExceeded'); }
      }
    };

    safeStorage.setItem('error_key', 'value');
    assert.strictEqual(warnLogs.length, 1);
    assert.ok(warnLogs[0][0].includes('Failed to write to localStorage'));
  });

  await t.test('removeItem gracefully handles errors and logs warning', () => {
    (global as any).window = {
      localStorage: {
        removeItem: () => { throw new Error('QuotaExceeded'); }
      }
    };

    safeStorage.removeItem('error_key');
    assert.strictEqual(warnLogs.length, 1);
    assert.ok(warnLogs[0][0].includes('Failed to remove from localStorage'));
  });

  await t.test('handles environments without window safely', () => {
    (global as any).window = undefined;

    safeStorage.setItem('no_window', 'value');
    assert.strictEqual(safeStorage.getItem('no_window'), null);
    safeStorage.removeItem('no_window');

    // In our implementation, missing window doesn't throw, it just does nothing
    assert.strictEqual(warnLogs.length, 0);
  });

  // Restore globals
  t.after(() => {
    global.window = originalWindow;
    console.warn = originalWarn;
  });
});
