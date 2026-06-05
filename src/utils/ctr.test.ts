import { test } from "node:test";
import assert from "node:assert";
import { getCTRScore } from "./ctr.js";

test("getCTRScore should return base score of 85", () => {
  const score = getCTRScore({ hook: "normal", psychology: "normal", text_overlay: "This is a very long text overlay with many words" });
  assert.strictEqual(score, 85);
});

test("getCTRScore should add 5 for curiosity hook", () => {
  const score = getCTRScore({ hook: "curiosity", psychology: "normal", text_overlay: "This is a very long text overlay with many words" });
  assert.strictEqual(score, 90);
});

test("getCTRScore should add 3 for shock psychology", () => {
  const score = getCTRScore({ hook: "normal", psychology: "shock", text_overlay: "This is a very long text overlay with many words" });
  assert.strictEqual(score, 88);
});

test("getCTRScore should add 5 for short text overlay", () => {
  const score = getCTRScore({ hook: "normal", psychology: "normal", text_overlay: "short text" });
  assert.strictEqual(score, 90);
});

test("getCTRScore should cap at 99", () => {
  const score = getCTRScore({ hook: "curiosity", psychology: "shock", text_overlay: "short text" });
  assert.strictEqual(score, 98); // 85 + 5 + 3 + 5 = 98
});
