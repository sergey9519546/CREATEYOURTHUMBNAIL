import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage interactions', async (t) => {
  let mockStorage: Record<string, string> = {};

  t.beforeEach(() => {
    mockStorage = {};
    (global as any).window = {
      localStorage: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
        removeItem: (key: string) => { delete mockStorage[key]; }
      }
    };
  });

  t.afterEach(() => {
    delete (global as any).window;
  });

  await t.test('setItem and getItem work correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
  });

  await t.test('removeItem works correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  await t.test('getItem handles exceptions gracefully', () => {
    (global as any).window.localStorage.getItem = () => { throw new Error('Storage disabled'); };
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });
});
