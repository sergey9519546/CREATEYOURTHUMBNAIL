import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage', async (t) => {
  // Mock localStorage
  const store: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; }
  };

  await t.test('setItem and getItem', () => {
    safeStorage.setItem('testKey', 'testValue');
    assert.strictEqual(safeStorage.getItem('testKey'), 'testValue');
  });

  await t.test('removeItem', () => {
    safeStorage.setItem('testKey2', 'testValue2');
    safeStorage.removeItem('testKey2');
    assert.strictEqual(safeStorage.getItem('testKey2'), null);
  });

  await t.test('handles exceptions gracefully', () => {
    (global as any).localStorage = {
      getItem: () => { throw new Error('QuotaExceeded'); },
      setItem: () => { throw new Error('QuotaExceeded'); },
      removeItem: () => { throw new Error('QuotaExceeded'); }
    };

    assert.doesNotThrow(() => {
      safeStorage.setItem('testKey3', 'testValue3');
    });

    assert.doesNotThrow(() => {
      safeStorage.removeItem('testKey3');
    });

    const result = safeStorage.getItem('testKey3');
    assert.strictEqual(result, null);
  });
});
