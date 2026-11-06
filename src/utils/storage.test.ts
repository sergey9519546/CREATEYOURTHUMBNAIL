import test from "node:test";
import assert from "node:assert";
import { safeStorage } from "./storage";

test("safeStorage getItem", () => {
  (global as any).window = { localStorage: {
    getItem: (key: string) => { if (key === "err") throw new Error(); return key === "k" ? "v" : null; },
    setItem: (key: string) => { if (key === "err") throw new Error(); },
    removeItem: (key: string) => { if (key === "err") throw new Error(); }
  } };
  (global as any).localStorage = (global as any).window.localStorage;

  assert.strictEqual(safeStorage.getItem("k"), "v");
  assert.strictEqual(safeStorage.getItem("err"), null);

  delete (global as any).window;
  delete (global as any).localStorage;
});

test("safeStorage setItem", () => {
  (global as any).window = { localStorage: {
    getItem: (key: string) => { if (key === "err") throw new Error(); return key === "k" ? "v" : null; },
    setItem: (key: string) => { if (key === "err") throw new Error(); },
    removeItem: (key: string) => { if (key === "err") throw new Error(); }
  } };
  (global as any).localStorage = (global as any).window.localStorage;

  assert.doesNotThrow(() => safeStorage.setItem("k", "v"));
  assert.doesNotThrow(() => safeStorage.setItem("err", "v"));

  delete (global as any).window;
  delete (global as any).localStorage;
});

test("safeStorage removeItem", () => {
  (global as any).window = { localStorage: {
    getItem: (key: string) => { if (key === "err") throw new Error(); return key === "k" ? "v" : null; },
    setItem: (key: string) => { if (key === "err") throw new Error(); },
    removeItem: (key: string) => { if (key === "err") throw new Error(); }
  } };
  (global as any).localStorage = (global as any).window.localStorage;

  assert.doesNotThrow(() => safeStorage.removeItem("k"));
  assert.doesNotThrow(() => safeStorage.removeItem("err"));

  delete (global as any).window;
  delete (global as any).localStorage;
});
