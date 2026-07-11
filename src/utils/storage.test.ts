import { test, beforeEach, afterEach } from 'node:test';
import * as assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage', async (t) => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    (global as any).localStorage = {
      getItem: t.mock.fn((key: string) => mockStorage[key] || null),
      setItem: t.mock.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: t.mock.fn((key: string) => {
        delete mockStorage[key];
      })
    };
  });

  afterEach(() => {
    delete (global as any).localStorage;
    t.mock.restoreAll();
  });

  await t.test('setItem and getItem success', () => {
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
  });

  await t.test('removeItem success', () => {
    safeStorage.setItem('test_key', 'test_value');
    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  await t.test('getItem catches exception and returns null', (t) => {
    (global as any).localStorage.getItem = t.mock.fn(() => { throw new Error('Quota exceeded'); });
    const result = safeStorage.getItem('test_key');
    assert.strictEqual(result, null);
  });

  await t.test('setItem catches exception', (t) => {
    (global as any).localStorage.setItem = t.mock.fn(() => { throw new Error('Quota exceeded'); });
    // Should not throw
    safeStorage.setItem('test_key', 'test_value');
    assert.ok(true);
  });

  await t.test('removeItem catches exception', (t) => {
    (global as any).localStorage.removeItem = t.mock.fn(() => { throw new Error('Quota exceeded'); });
    // Should not throw
    safeStorage.removeItem('test_key');
    assert.ok(true);
  });
});
