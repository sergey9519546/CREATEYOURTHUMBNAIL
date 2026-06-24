import test from "node:test";
import assert from "node:assert";
import { safeStorage } from "./storage.js";

test("safeStorage getItem success", () => {
  (global as any).localStorage = {
    getItem: test.mock.fn(() => "test_value")
  };
  assert.strictEqual(safeStorage.getItem("key1"), "test_value");
});

test("safeStorage getItem throws error", () => {
  (global as any).localStorage = {
    getItem: test.mock.fn(() => { throw new Error("Quota Exceeded"); })
  };
  const originalWarn = console.warn;
  console.warn = test.mock.fn();
  assert.strictEqual(safeStorage.getItem("key2"), null);
  console.warn = originalWarn;
});

test("safeStorage setItem success", () => {
  let store: any = {};
  (global as any).localStorage = {
    setItem: test.mock.fn((key: string, value: string) => { store[key] = value; })
  };
  safeStorage.setItem("key3", "val3");
  assert.strictEqual(store["key3"], "val3");
});
