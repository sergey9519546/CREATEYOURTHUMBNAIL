import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    (global as any).localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value; },
      removeItem: (key: string) => { delete mockStorage[key]; }
    };
    (global as any).window = { localStorage: (global as any).localStorage };
  });

  afterEach(() => {
    delete (global as any).localStorage;
    delete (global as any).window;
  });

  test('setItem stores a value successfully', () => {
    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(mockStorage['test_key'], 'test_value');
  });

  test('getItem retrieves a stored value', () => {
    mockStorage['test_key'] = 'test_value';
    const result = safeStorage.getItem('test_key');
    assert.strictEqual(result, 'test_value');
  });

  test('getItem returns null for non-existent key', () => {
    const result = safeStorage.getItem('non_existent');
    assert.strictEqual(result, null);
  });

  test('removeItem deletes a stored value', () => {
    mockStorage['test_key'] = 'test_value';
    safeStorage.removeItem('test_key');
    assert.strictEqual(mockStorage['test_key'], undefined);
  });

  test('setItem handles exceptions gracefully', () => {
    let warnCalled = false;
    const originalWarn = console.warn;
    console.warn = () => { warnCalled = true; };

    (global as any).localStorage.setItem = () => {
      throw new Error('Quota exceeded');
    };

    assert.doesNotThrow(() => {
      safeStorage.setItem('test_key', 'test_value');
    });
    assert.strictEqual(warnCalled, true);

    console.warn = originalWarn;
  });

  test('getItem handles exceptions gracefully', () => {
    let warnCalled = false;
    const originalWarn = console.warn;
    console.warn = () => { warnCalled = true; };

    (global as any).localStorage.getItem = () => {
      throw new Error('Access denied');
    };

    let result;
    assert.doesNotThrow(() => {
      result = safeStorage.getItem('test_key');
    });
    assert.strictEqual(result, null);
    assert.strictEqual(warnCalled, true);

    console.warn = originalWarn;
  });

  test('removeItem handles exceptions gracefully', () => {
    let warnCalled = false;
    const originalWarn = console.warn;
    console.warn = () => { warnCalled = true; };

    (global as any).localStorage.removeItem = () => {
      throw new Error('Access denied');
    };

    assert.doesNotThrow(() => {
      safeStorage.removeItem('test_key');
    });
    assert.strictEqual(warnCalled, true);

    console.warn = originalWarn;
  });
});
