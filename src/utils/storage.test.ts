import test, { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

describe('safeStorage', () => {
  let originalLocalStorage: any;
  let mockStorage: any;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    mockStorage = {
      getItem: mock.fn(),
      setItem: mock.fn(),
      removeItem: mock.fn()
    };
    (global as any).localStorage = mockStorage;
  });

  afterEach(() => {
    (global as any).localStorage = originalLocalStorage;
    mock.restoreAll();
  });

  it('setItem should call localStorage.setItem', () => {
    safeStorage.setItem('key', 'value');
    assert.strictEqual(mockStorage.setItem.mock.calls.length, 1);
    assert.deepStrictEqual(mockStorage.setItem.mock.calls[0].arguments, ['key', 'value']);
  });

  it('getItem should call localStorage.getItem', () => {
    mockStorage.getItem = mock.fn(() => 'value');
    (global as any).localStorage = mockStorage;
    const result = safeStorage.getItem('key');
    assert.strictEqual(result, 'value');
    assert.strictEqual(mockStorage.getItem.mock.calls.length, 1);
    assert.deepStrictEqual(mockStorage.getItem.mock.calls[0].arguments, ['key']);
  });

  it('removeItem should call localStorage.removeItem', () => {
    safeStorage.removeItem('key');
    assert.strictEqual(mockStorage.removeItem.mock.calls.length, 1);
    assert.deepStrictEqual(mockStorage.removeItem.mock.calls[0].arguments, ['key']);
  });

  it('setItem should handle exceptions silently', () => {
    mockStorage.setItem = mock.fn(() => { throw new Error('QuotaExceededError'); });
    (global as any).localStorage = mockStorage;
    assert.doesNotThrow(() => {
      safeStorage.setItem('key', 'value');
    });
  });

  it('getItem should handle exceptions silently and return null', () => {
    mockStorage.getItem = mock.fn(() => { throw new Error('SecurityError'); });
    (global as any).localStorage = mockStorage;
    let result: string | null = 'not-null';
    assert.doesNotThrow(() => {
      result = safeStorage.getItem('key');
    });
    assert.strictEqual(result, null);
  });
});
