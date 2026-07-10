import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { safeStorage } from './storage';

describe('safeStorage', () => {
  let mockStorage: Record<string, string>;
  let mockGetItem: any;
  let mockSetItem: any;
  let mockRemoveItem: any;
  let originalWarn: typeof console.warn;
  let warnMock: any;

  beforeEach((t) => {
    mockStorage = {};
    mockGetItem = t.mock.fn((key: string) => mockStorage[key] || null);
    mockSetItem = t.mock.fn((key: string, value: string) => { mockStorage[key] = value; });
    mockRemoveItem = t.mock.fn((key: string) => { delete mockStorage[key]; });

    (global as any).localStorage = {
      getItem: mockGetItem,
      setItem: mockSetItem,
      removeItem: mockRemoveItem
    };

    originalWarn = console.warn;
    warnMock = t.mock.fn();
    console.warn = warnMock;
  });

  afterEach(() => {
    delete (global as any).localStorage;
    console.warn = originalWarn;
  });

  test('getItem returns value if exists', () => {
    mockStorage['testKey'] = 'testValue';
    const value = safeStorage.getItem('testKey');
    assert.strictEqual(value, 'testValue');
    assert.strictEqual(mockGetItem.mock.callCount(), 1);
  });

  test('getItem returns null if key does not exist', () => {
    const value = safeStorage.getItem('nonExistentKey');
    assert.strictEqual(value, null);
  });

  test('getItem catches exception and returns null', () => {
    mockGetItem.mock.mockImplementation(() => { throw new Error('Storage disabled'); });
    const value = safeStorage.getItem('testKey');
    assert.strictEqual(value, null);
    assert.strictEqual(warnMock.mock.callCount(), 1);
  });

  test('setItem sets value successfully', () => {
    safeStorage.setItem('testKey', 'testValue');
    assert.strictEqual(mockStorage['testKey'], 'testValue');
    assert.strictEqual(mockSetItem.mock.callCount(), 1);
  });

  test('setItem catches exception', () => {
    mockSetItem.mock.mockImplementation(() => { throw new Error('Quota exceeded'); });
    safeStorage.setItem('testKey', 'testValue');
    assert.strictEqual(warnMock.mock.callCount(), 1);
  });

  test('removeItem removes value successfully', () => {
    mockStorage['testKey'] = 'testValue';
    safeStorage.removeItem('testKey');
    assert.strictEqual(mockStorage['testKey'], undefined);
    assert.strictEqual(mockRemoveItem.mock.callCount(), 1);
  });

  test('removeItem catches exception', () => {
    mockRemoveItem.mock.mockImplementation(() => { throw new Error('Storage disabled'); });
    safeStorage.removeItem('testKey');
    assert.strictEqual(warnMock.mock.callCount(), 1);
  });
});
