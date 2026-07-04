import { test } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage tests', async (t) => {
  await t.test('setItem and getItem should work', () => {
    const store: Record<string, string> = {};
    (global as any).localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; }
    };

    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
  });

  await t.test('removeItem should work', () => {
    const store: Record<string, string> = { test_key: 'test_value' };
    (global as any).localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; }
    };

    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  await t.test('getItem should handle errors safely', (tContext) => {
    (global as any).localStorage = {
      getItem: () => { throw new Error('Storage disabled'); }
    };

    // suppress console.warn during test
    const mockWarn = tContext.mock.method(console, 'warn', () => {});

    assert.strictEqual(safeStorage.getItem('test_key'), null);
    assert.strictEqual(mockWarn.mock.callCount(), 1);
  });

  await t.test('setItem should handle errors safely', (tContext) => {
    (global as any).localStorage = {
      setItem: () => { throw new Error('Storage disabled'); }
    };

    const mockWarn = tContext.mock.method(console, 'warn', () => {});

    assert.doesNotThrow(() => {
      safeStorage.setItem('test_key', 'test_value');
    });
    assert.strictEqual(mockWarn.mock.callCount(), 1);
  });

  await t.test('removeItem should handle errors safely', (tContext) => {
    (global as any).localStorage = {
      removeItem: () => { throw new Error('Storage disabled'); }
    };

    const mockWarn = tContext.mock.method(console, 'warn', () => {});

    assert.doesNotThrow(() => {
      safeStorage.removeItem('test_key');
    });
    assert.strictEqual(mockWarn.mock.callCount(), 1);
  });
});
