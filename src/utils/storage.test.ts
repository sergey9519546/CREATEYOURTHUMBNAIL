import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage getItem returns item if exists', () => {
  const store = new Map<string, string>();
  store.set('key1', 'value1');

  const mockLocalStorage = {
    getItem: (key: string) => store.has(key) ? store.get(key) : null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  };

  (global as any).localStorage = mockLocalStorage;

  assert.strictEqual(safeStorage.getItem('key1'), 'value1');
  assert.strictEqual(safeStorage.getItem('key2'), null);
});

test('safeStorage getItem handles errors gracefully', (t) => {
  const mockLocalStorage = {
    getItem: () => { throw new Error('Quota exceeded'); },
    setItem: () => {},
    removeItem: () => {},
  };

  (global as any).localStorage = mockLocalStorage;

  const warnSpy = t.mock.method(console, 'warn', () => {});

  assert.strictEqual(safeStorage.getItem('key1'), null);
  assert.strictEqual(warnSpy.mock.calls.length, 1);
});

test('safeStorage setItem works', () => {
  const store = new Map<string, string>();
  const mockLocalStorage = {
    getItem: (key: string) => store.has(key) ? store.get(key) : null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  };

  (global as any).localStorage = mockLocalStorage;

  safeStorage.setItem('key3', 'value3');
  assert.strictEqual(store.get('key3'), 'value3');
});

test('safeStorage setItem handles errors gracefully', (t) => {
  const mockLocalStorage = {
    getItem: () => null,
    setItem: () => { throw new Error('Quota exceeded'); },
    removeItem: () => {},
  };

  (global as any).localStorage = mockLocalStorage;

  const warnSpy = t.mock.method(console, 'warn', () => {});

  safeStorage.setItem('key4', 'value4');
  assert.strictEqual(warnSpy.mock.calls.length, 1);
});

test('safeStorage removeItem works', () => {
  const store = new Map<string, string>();
  store.set('key5', 'value5');
  const mockLocalStorage = {
    getItem: (key: string) => store.has(key) ? store.get(key) : null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  };

  (global as any).localStorage = mockLocalStorage;

  safeStorage.removeItem('key5');
  assert.strictEqual(store.has('key5'), false);
});
