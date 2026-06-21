import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage.js';

test('safeStorage methods exist and run without crashing', () => {
  assert.ok(typeof safeStorage.getItem === 'function');
  assert.ok(typeof safeStorage.setItem === 'function');
  assert.ok(typeof safeStorage.removeItem === 'function');

  // They should not crash, even if localStorage is not defined in this environment
  const item = safeStorage.getItem('test_key');
  assert.strictEqual(item, null);

  safeStorage.setItem('test_key', 'test_value');
  safeStorage.removeItem('test_key');
});
