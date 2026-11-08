import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from '../storage.js';

test('safeStorage methods', async (t) => {
  let mockStorage: Record<string, string> = {};

  await t.test('setItem and getItem success', () => {
    (global as any).window = {
      localStorage: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, val: string) => { mockStorage[key] = val; },
        removeItem: (key: string) => { delete mockStorage[key]; }
      }
    };
    (global as any).localStorage = (global as any).window.localStorage;

    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');

    delete (global as any).window;
    delete (global as any).localStorage;
    mockStorage = {};
  });

  await t.test('removeItem success', () => {
    mockStorage = { 'test_key': 'test_value' };
    (global as any).window = {
      localStorage: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, val: string) => { mockStorage[key] = val; },
        removeItem: (key: string) => { delete mockStorage[key]; }
      }
    };
    (global as any).localStorage = (global as any).window.localStorage;

    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);

    delete (global as any).window;
    delete (global as any).localStorage;
    mockStorage = {};
  });

  await t.test('getItem handles exceptions', () => {
    (global as any).window = {
      localStorage: {
        getItem: () => { throw new Error('Quota exceeded'); }
      }
    };
    (global as any).localStorage = (global as any).window.localStorage;

    assert.strictEqual(safeStorage.getItem('test_key'), null);

    delete (global as any).window;
    delete (global as any).localStorage;
  });
});