import test, { describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { safeStorage } from "./storage.js";

describe("safeStorage", () => {
  const mockLocalStorage = {
    getItem: test.mock.fn(),
    setItem: test.mock.fn(),
    removeItem: test.mock.fn()
  };

  const originalConsoleWarn = console.warn;
  const mockConsoleWarn = test.mock.fn();

  beforeEach(() => {
    global.localStorage = mockLocalStorage as any;
    console.warn = mockConsoleWarn;
    mockConsoleWarn.mock.resetCalls();
    mockLocalStorage.getItem.mock.resetCalls();
    mockLocalStorage.setItem.mock.resetCalls();
    mockLocalStorage.removeItem.mock.resetCalls();
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  describe("getItem", () => {
    test("returns value on success", () => {
      mockLocalStorage.getItem.mock.mockImplementation(() => "value" as any);
      const result = safeStorage.getItem("key");
      assert.strictEqual(result, "value");
      assert.strictEqual(mockLocalStorage.getItem.mock.calls.length, 1);
    });

    test("returns null and logs warning on error", () => {
      mockLocalStorage.getItem.mock.mockImplementation(() => { throw new Error("quota"); });
      const result = safeStorage.getItem("key");
      assert.strictEqual(result, null);
      assert.strictEqual(mockConsoleWarn.mock.calls.length, 1);
    });
  });

  describe("setItem", () => {
    test("sets value on success", () => {
      safeStorage.setItem("key", "value");
      assert.strictEqual(mockLocalStorage.setItem.mock.calls.length, 1);
      assert.strictEqual(mockConsoleWarn.mock.calls.length, 0);
    });

    test("logs warning on error", () => {
      mockLocalStorage.setItem.mock.mockImplementation(() => { throw new Error("quota"); });
      safeStorage.setItem("key", "value");
      assert.strictEqual(mockConsoleWarn.mock.calls.length, 1);
    });
  });

  describe("removeItem", () => {
    test("removes value on success", () => {
      safeStorage.removeItem("key");
      assert.strictEqual(mockLocalStorage.removeItem.mock.calls.length, 1);
      assert.strictEqual(mockConsoleWarn.mock.calls.length, 0);
    });

    test("logs warning on error", () => {
      mockLocalStorage.removeItem.mock.mockImplementation(() => { throw new Error("quota"); });
      safeStorage.removeItem("key");
      assert.strictEqual(mockConsoleWarn.mock.calls.length, 1);
    });
  });
});
