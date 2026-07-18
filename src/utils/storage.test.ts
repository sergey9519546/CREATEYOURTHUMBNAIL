import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage tests', async (t) => {
  const originalLocalStorage = global.localStorage;

  t.afterEach(() => {
    // Restore or delete the global mock after each test
    global.localStorage = originalLocalStorage;
  });

  await t.test('getItem works when storage is available', () => {
    global.localStorage = {
      getItem: (key: string) => (key === 'test-key' ? 'test-value' : null),
    } as any;

    assert.strictEqual(safeStorage.getItem('test-key'), 'test-value');
    assert.strictEqual(safeStorage.getItem('non-existent'), null);
  });

  await t.test('getItem gracefully handles exceptions', () => {
    global.localStorage = {
      getItem: () => {
        throw new Error('Access denied');
      },
    } as any;

    // Suppress console.warn during this test to keep output clean
    const originalWarn = console.warn;
    console.warn = () => {};

    assert.strictEqual(safeStorage.getItem('test-key'), null);

    console.warn = originalWarn;
  });

  await t.test('setItem works when storage is available', (t) => {
    const storageObj: Record<string, string> = {};
    global.localStorage = {
      setItem: (key: string, value: string) => {
        storageObj[key] = value;
      },
    } as any;

    safeStorage.setItem('test-key', 'test-value');
    assert.strictEqual(storageObj['test-key'], 'test-value');
  });

  await t.test('setItem gracefully handles exceptions', () => {
    global.localStorage = {
      setItem: () => {
        throw new Error('Quota exceeded');
      },
    } as any;

    const originalWarn = console.warn;
    let warned = false;
    console.warn = () => { warned = true; };

    assert.doesNotThrow(() => {
      safeStorage.setItem('test-key', 'test-value');
    });
    assert.ok(warned);

    console.warn = originalWarn;
  });

  await t.test('removeItem works when storage is available', () => {
    const storageObj: Record<string, string> = { 'test-key': 'test-value' };
    global.localStorage = {
      removeItem: (key: string) => {
        delete storageObj[key];
      },
    } as any;

    safeStorage.removeItem('test-key');
    assert.strictEqual(storageObj['test-key'], undefined);
  });

  await t.test('removeItem gracefully handles exceptions', () => {
    global.localStorage = {
      removeItem: () => {
        throw new Error('Access denied');
      },
    } as any;

    const originalWarn = console.warn;
    console.warn = () => {};

    assert.doesNotThrow(() => {
      safeStorage.removeItem('test-key');
    });

    console.warn = originalWarn;
  });
});
