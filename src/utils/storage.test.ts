import test, { describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

describe('safeStorage', () => {
  let mockStorage: Record<string, string>;
  let originalWarn: typeof console.warn;
  let originalLocalStorage: Storage | undefined;

  beforeEach(() => {
    mockStorage = {};

    // Mock localStorage
    const mockLocalStorage = {
      getItem: mock.fn((key: string) => mockStorage[key] || null),
      setItem: mock.fn((key: string, value: string) => { mockStorage[key] = value; }),
      removeItem: mock.fn((key: string) => { delete mockStorage[key]; }),
    };

    // Save and stub globals
    originalWarn = console.warn;
    console.warn = mock.fn();

    // @ts-ignore
    originalLocalStorage = global.localStorage;
    // @ts-ignore
    global.localStorage = mockLocalStorage;
  });

  afterEach(() => {
    console.warn = originalWarn;
    // @ts-ignore
    global.localStorage = originalLocalStorage;
  });

  test('getItem returns value when it exists', () => {
    mockStorage['test_key'] = 'test_value';
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
  });

  test('getItem returns null when it does not exist', () => {
    assert.strictEqual(safeStorage.getItem('missing_key'), null);
  });

  test('setItem sets a value', () => {
    safeStorage.setItem('new_key', 'new_value');
    assert.strictEqual(mockStorage['new_key'], 'new_value');
  });

  test('removeItem removes a value', () => {
    mockStorage['key_to_remove'] = 'value';
    safeStorage.removeItem('key_to_remove');
    assert.strictEqual(mockStorage['key_to_remove'], undefined);
  });

  test('handles errors gracefully during getItem', () => {
    // Override local mock to throw
    // @ts-ignore
    global.localStorage.getItem = () => { throw new Error('Storage disabled'); };

    assert.strictEqual(safeStorage.getItem('test_key'), null);
    // @ts-ignore
    assert.strictEqual(console.warn.mock.calls.length, 1);
  });

  test('handles errors gracefully during setItem', () => {
    // Override local mock to throw
    // @ts-ignore
    global.localStorage.setItem = () => { throw new Error('Storage full'); };

    assert.doesNotThrow(() => {
      safeStorage.setItem('test_key', 'test_value');
    });
    // @ts-ignore
    assert.strictEqual(console.warn.mock.calls.length, 1);
  });

  test('handles errors gracefully during removeItem', () => {
    // Override local mock to throw
    // @ts-ignore
    global.localStorage.removeItem = () => { throw new Error('Storage read-only'); };

    assert.doesNotThrow(() => {
      safeStorage.removeItem('test_key');
    });
    // @ts-ignore
    assert.strictEqual(console.warn.mock.calls.length, 1);
  });
});
