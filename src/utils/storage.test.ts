import { test } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage.getItem', (t) => {
  const store = new Map<string, string>();
  (global as any).localStorage = {
    getItem: t.mock.fn((key: string) => store.get(key) || null),
    setItem: t.mock.fn((key: string, value: string) => store.set(key, value)),
    removeItem: t.mock.fn((key: string) => store.delete(key)),
  };

  store.set('test_key', 'test_value');
  const result = safeStorage.getItem('test_key');
  assert.strictEqual(result, 'test_value');

  const missing = safeStorage.getItem('missing_key');
  assert.strictEqual(missing, null);
});

test('safeStorage.setItem', (t) => {
  const store = new Map<string, string>();
  (global as any).localStorage = {
    getItem: t.mock.fn((key: string) => store.get(key) || null),
    setItem: t.mock.fn((key: string, value: string) => store.set(key, value)),
    removeItem: t.mock.fn((key: string) => store.delete(key)),
  };

  safeStorage.setItem('test_key2', 'test_value2');
  assert.strictEqual(store.get('test_key2'), 'test_value2');
});

test('safeStorage.removeItem', (t) => {
  const store = new Map<string, string>();
  (global as any).localStorage = {
    getItem: t.mock.fn((key: string) => store.get(key) || null),
    setItem: t.mock.fn((key: string, value: string) => store.set(key, value)),
    removeItem: t.mock.fn((key: string) => store.delete(key)),
  };

  store.set('test_key3', 'test_value3');
  safeStorage.removeItem('test_key3');
  assert.strictEqual(store.has('test_key3'), false);
});

test('safeStorage catches exceptions gracefully', (t) => {
  (global as any).localStorage = {
    getItem: t.mock.fn(() => { throw new Error('Quota exceeded'); }),
    setItem: t.mock.fn(() => { throw new Error('Quota exceeded'); }),
    removeItem: t.mock.fn(() => { throw new Error('Quota exceeded'); }),
  };

  const origWarn = console.warn;
  let warnCalled = false;
  console.warn = () => { warnCalled = true; };

  const result = safeStorage.getItem('test_key');
  assert.strictEqual(result, null);
  assert.strictEqual(warnCalled, true);

  warnCalled = false;
  assert.doesNotThrow(() => { safeStorage.setItem('test_key', 'value'); });
  assert.strictEqual(warnCalled, true);

  warnCalled = false;
  assert.doesNotThrow(() => { safeStorage.removeItem('test_key'); });
  assert.strictEqual(warnCalled, true);

  console.warn = origWarn;
});
