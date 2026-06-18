import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

describe('safeStorage', () => {
  let localStorageMock: any;
  let originalLocalStorage: any;
  let consoleWarnMock: any;
  let originalConsoleWarn: any;

  beforeEach(() => {
    localStorageMock = {
      getItem: test.mock.fn(),
      setItem: test.mock.fn(),
      removeItem: test.mock.fn(),
    };
    originalLocalStorage = global.localStorage;
    (global as any).localStorage = localStorageMock;

    consoleWarnMock = test.mock.fn();
    originalConsoleWarn = console.warn;
    console.warn = consoleWarnMock;
  });

  afterEach(() => {
    (global as any).localStorage = originalLocalStorage;
    console.warn = originalConsoleWarn;
  });

  test('getItem returns value when successful', () => {
    localStorageMock.getItem.mock.mockImplementation(() => 'test_value');
    const result = safeStorage.getItem('test_key');
    assert.strictEqual(result, 'test_value');
    assert.strictEqual(localStorageMock.getItem.mock.calls.length, 1);
  });

  test('getItem returns null and logs warning on error', () => {
    localStorageMock.getItem.mock.mockImplementation(() => { throw new Error('QuotaExceededError'); });
    const result = safeStorage.getItem('test_key');
    assert.strictEqual(result, null);
    assert.strictEqual(consoleWarnMock.mock.calls.length, 1);
  });

  test('setItem saves value successfully', () => {
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(localStorageMock.setItem.mock.calls.length, 1);
    assert.strictEqual(localStorageMock.setItem.mock.calls[0].arguments[0], 'test_key');
    assert.strictEqual(localStorageMock.setItem.mock.calls[0].arguments[1], 'test_value');
  });

  test('setItem logs warning on error', () => {
    localStorageMock.setItem.mock.mockImplementation(() => { throw new Error('QuotaExceededError'); });
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(consoleWarnMock.mock.calls.length, 1);
  });

  test('removeItem removes value successfully', () => {
    safeStorage.removeItem('test_key');
    assert.strictEqual(localStorageMock.removeItem.mock.calls.length, 1);
    assert.strictEqual(localStorageMock.removeItem.mock.calls[0].arguments[0], 'test_key');
  });

  test('removeItem logs warning on error', () => {
    localStorageMock.removeItem.mock.mockImplementation(() => { throw new Error('AccessDeniedError'); });
    safeStorage.removeItem('test_key');
    assert.strictEqual(consoleWarnMock.mock.calls.length, 1);
  });
});
