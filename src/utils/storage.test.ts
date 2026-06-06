import test from 'node:test';
import assert from 'node:assert';
import { safeGetLocalStorageItem, safeSetLocalStorageItem, safeRemoveLocalStorageItem } from './storage.js';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

test('safeSetLocalStorageItem sets value', () => {
  safeSetLocalStorageItem('test_key', 'test_value');
  assert.strictEqual(localStorage.getItem('test_key'), 'test_value');
});

test('safeGetLocalStorageItem gets value', () => {
  localStorage.setItem('test_key', 'test_value');
  assert.strictEqual(safeGetLocalStorageItem('test_key'), 'test_value');
});

test('safeRemoveLocalStorageItem removes value', () => {
  localStorage.setItem('test_key', 'test_value');
  safeRemoveLocalStorageItem('test_key');
  assert.strictEqual(localStorage.getItem('test_key'), null);
});
