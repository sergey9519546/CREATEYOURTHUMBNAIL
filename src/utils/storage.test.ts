import test from "node:test";
import assert from "node:assert";
import { safeStorage } from "./storage.js";

test("safeStorage getItem returns value from localStorage", (t) => {
  const originalGetItem = global.localStorage?.getItem;
  global.localStorage = {
    ...global.localStorage,
    getItem: (key: string) => {
      if (key === 'testKey') return 'testValue';
      return null;
    }
  } as Storage;

  const result = safeStorage.getItem('testKey');
  assert.strictEqual(result, 'testValue');

  if (originalGetItem) {
      global.localStorage.getItem = originalGetItem;
  }
});

test("safeStorage getItem catches error and returns null", (t) => {
    const originalGetItem = global.localStorage?.getItem;
    global.localStorage = {
      ...global.localStorage,
      getItem: (key: string) => {
        throw new Error("Storage quota exceeded");
      }
    } as Storage;
    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = () => { warnCalled = true; };

    const result = safeStorage.getItem('testKey');
    assert.strictEqual(result, null);
    assert.strictEqual(warnCalled, true);

    if (originalGetItem) {
        global.localStorage.getItem = originalGetItem;
    }
    console.warn = originalWarn;
});

test("safeStorage setItem saves value to localStorage", (t) => {
    const originalSetItem = global.localStorage?.setItem;
    let storedKey = '';
    let storedValue = '';
    global.localStorage = {
      ...global.localStorage,
      setItem: (key: string, value: string) => {
        storedKey = key;
        storedValue = value;
      }
    } as Storage;

    safeStorage.setItem('testKey', 'testValue');
    assert.strictEqual(storedKey, 'testKey');
    assert.strictEqual(storedValue, 'testValue');

    if (originalSetItem) {
        global.localStorage.setItem = originalSetItem;
    }
});

test("safeStorage setItem catches error", (t) => {
    const originalSetItem = global.localStorage?.setItem;
    global.localStorage = {
      ...global.localStorage,
      setItem: (key: string, value: string) => {
        throw new Error("Storage full");
      }
    } as Storage;
    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = () => { warnCalled = true; };

    safeStorage.setItem('testKey', 'testValue');
    assert.strictEqual(warnCalled, true);

    if (originalSetItem) {
        global.localStorage.setItem = originalSetItem;
    }
    console.warn = originalWarn;
});

test("safeStorage removeItem removes value from localStorage", (t) => {
    const originalRemoveItem = global.localStorage?.removeItem;
    let removedKey = '';
    global.localStorage = {
      ...global.localStorage,
      removeItem: (key: string) => {
        removedKey = key;
      }
    } as Storage;

    safeStorage.removeItem('testKey');
    assert.strictEqual(removedKey, 'testKey');

    if (originalRemoveItem) {
        global.localStorage.removeItem = originalRemoveItem;
    }
});

test("safeStorage removeItem catches error", (t) => {
    const originalRemoveItem = global.localStorage?.removeItem;
    global.localStorage = {
      ...global.localStorage,
      removeItem: (key: string) => {
        throw new Error("Cannot remove");
      }
    } as Storage;
    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = () => { warnCalled = true; };

    safeStorage.removeItem('testKey');
    assert.strictEqual(warnCalled, true);

    if (originalRemoveItem) {
        global.localStorage.removeItem = originalRemoveItem;
    }
    console.warn = originalWarn;
});