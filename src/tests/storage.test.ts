import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from '../utils/storage.js'; // Use .js extension for node execution if needed, or stick to .ts for tsx

describe('safeStorage', () => {
  let mockStorage: Record<string, string> = {};
  let originalWindow: any;
  let errorLogs: any[][] = [];
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    mockStorage = {};
    errorLogs = [];

    // Mock window and localStorage
    originalWindow = (global as any).window;
    (global as any).window = {
      localStorage: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
        removeItem: (key: string) => { delete mockStorage[key]; }
      }
    };

    // Mock console.error
    originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      errorLogs.push(args);
    };
  });

  afterEach(() => {
    (global as any).window = originalWindow;
    console.error = originalConsoleError;
  });

  test('setItem and getItem should work correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');
    assert.strictEqual(errorLogs.length, 0);
  });

  test('removeItem should work correctly', () => {
    safeStorage.setItem('test_key', 'test_value');
    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);
    assert.strictEqual(errorLogs.length, 0);
  });

  test('getItem should handle JSON correctly', () => {
    safeStorage.setItem('test_obj', JSON.stringify({ a: 1 }));
    const result = safeStorage.getItem('test_obj');
    assert.strictEqual(result, '{"a":1}');
  });

  test('setItem should catch and log errors gracefully', () => {
    // Simulate quota exceeded
    (global as any).window.localStorage.setItem = () => {
      throw new Error('Quota exceeded');
    };

    safeStorage.setItem('error_key', 'value');
    assert.strictEqual(errorLogs.length, 1);
    assert.strictEqual(errorLogs[0][0], 'Error setting error_key in localStorage:');
    assert.strictEqual(errorLogs[0][1].message, 'Quota exceeded');
  });

  test('getItem should catch and log errors gracefully', () => {
    (global as any).window.localStorage.getItem = () => {
      throw new Error('Access denied');
    };

    const result = safeStorage.getItem('error_key');
    assert.strictEqual(result, null);
    assert.strictEqual(errorLogs.length, 1);
    assert.strictEqual(errorLogs[0][0], 'Error reading error_key from localStorage:');
  });

  test('removeItem should catch and log errors gracefully', () => {
    (global as any).window.localStorage.removeItem = () => {
      throw new Error('Storage error');
    };

    safeStorage.removeItem('error_key');
    assert.strictEqual(errorLogs.length, 1);
    assert.strictEqual(errorLogs[0][0], 'Error removing error_key from localStorage:');
  });
});
