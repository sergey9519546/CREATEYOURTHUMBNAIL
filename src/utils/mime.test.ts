import { test } from "node:test";
import assert from "node:assert";
import { getMimeType } from "./mime.js";

test("getMimeType should extract image/png correctly", () => {
  const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  assert.strictEqual(getMimeType(dataUrl), "image/png");
});

test("getMimeType should extract image/jpeg correctly", () => {
  const dataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...";
  assert.strictEqual(getMimeType(dataUrl), "image/jpeg");
});

test("getMimeType should extract image/webp correctly", () => {
  const dataUrl = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
  assert.strictEqual(getMimeType(dataUrl), "image/webp");
});

test("getMimeType should default to image/png for invalid data URLs", () => {
  const invalidDataUrl = "invalid-data-url-without-mime-type";
  assert.strictEqual(getMimeType(invalidDataUrl), "image/png");
});

test("getMimeType should default to image/png for empty string", () => {
  assert.strictEqual(getMimeType(""), "image/png");
});
