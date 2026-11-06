import test, { beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage tests', async (t) => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    (global as any).window = {
      localStorage: {
        getItem: mock.fn((key: string) => mockStorage[key] || null),
        setItem: mock.fn((key: string, value: string) => { mockStorage[key] = value; }),
        removeItem: mock.fn((key: string) => { delete mockStorage[key]; })
      }
    };
  });

  afterEach(() => {
    delete (global as any).window;
    mock.restoreAll();
  });

  await t.test('setItem works correctly without throwing', () => {
    safeStorage.setItem('test-key', 'test-value');
    assert.strictEqual(mockStorage['test-key'], 'test-value');
    assert.strictEqual(((global as any).window.localStorage.setItem as any).mock.callCount(), 1);
  });

  await t.test('getItem returns the mocked value', () => {
    mockStorage['test-key-2'] = 'test-value-2';
    const result = safeStorage.getItem('test-key-2');
    assert.strictEqual(result, 'test-value-2');
  });

  await t.test('setItem catches quota error, does not throw, and logs a console error', () => {
    const errorMsg = 'QuotaExceededError';
    (global as any).window.localStorage.setItem = mock.fn(() => { throw new Error(errorMsg); });

    const consoleErrorMock = mock.method(console, 'error', () => {});

    assert.doesNotThrow(() => {
      safeStorage.setItem('test-key', 'test-value');
    });

    assert.strictEqual(consoleErrorMock.mock.callCount(), 1);

    consoleErrorMock.mock.restore();
  });
});
