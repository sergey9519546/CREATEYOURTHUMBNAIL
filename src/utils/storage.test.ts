import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  let originalLocalStorage: any;
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    originalLocalStorage = (global as any).localStorage;
    (global as any).localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; }
    };
  });

  afterEach(() => {
    (global as any).localStorage = originalLocalStorage;
  });

  test('getItem successfully retrieves a value', () => {
    store['test_key'] = 'test_value';
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
  });

  test('getItem returns null for missing key', () => {
    assert.strictEqual(safeStorage.getItem('missing_key'), null);
  });

  test('getItem catches errors and returns null', (t) => {
    (global as any).localStorage.getItem = () => { throw new Error('Storage disabled'); };
    assert.strictEqual(safeStorage.getItem('test_key'), null);
  });

  test('setItem successfully sets a value', () => {
    safeStorage.setItem('test_key', 'new_value');
    assert.strictEqual(store['test_key'], 'new_value');
  });

  test('setItem catches errors gracefully', (t) => {
    (global as any).localStorage.setItem = () => { throw new Error('Storage full'); };
    assert.doesNotThrow(() => {
      safeStorage.setItem('test_key', 'value');
    });
  });

  test('removeItem successfully removes a value', () => {
    store['test_key'] = 'value';
    safeStorage.removeItem('test_key');
    assert.strictEqual(store['test_key'], undefined);
  });

  test('removeItem catches errors gracefully', (t) => {
    (global as any).localStorage.removeItem = () => { throw new Error('Storage access denied'); };
    assert.doesNotThrow(() => {
      safeStorage.removeItem('test_key');
    });
  });
});
