import { test } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from '../src/utils/storage';

test('safeStorage works in node without window', () => {
    assert.strictEqual(safeStorage.getItem('foo'), null);
});

test('safeStorage works with mock window', (t) => {
    const mockStorage = {
        store: {} as Record<string, string>,
        getItem(key: string) { return this.store[key] || null; },
        setItem(key: string, val: string) { this.store[key] = val; },
        removeItem(key: string) { delete this.store[key]; }
    };

    (global as any).window = { localStorage: mockStorage };

    safeStorage.setItem('test_key', 'test_value');
    assert.strictEqual(safeStorage.getItem('test_key'), 'test_value');

    safeStorage.removeItem('test_key');
    assert.strictEqual(safeStorage.getItem('test_key'), null);

    delete (global as any).window;
});
