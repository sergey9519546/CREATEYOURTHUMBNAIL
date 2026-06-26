import test from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

test('safeStorage wrapper operations', () => {
    // Setup mock localStorage
    let storage: Record<string, string> = {};
    (global as any).localStorage = {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, val: string) => { storage[key] = val; },
        removeItem: (key: string) => { delete storage[key]; }
    };

    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');

    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);

    // Test error handling by breaking mock
    (global as any).localStorage.setItem = () => { throw new Error('Quota exceeded'); };
    assert.doesNotThrow(() => {
        safeStorage.setItem('fail_key', 'val');
    });
});
