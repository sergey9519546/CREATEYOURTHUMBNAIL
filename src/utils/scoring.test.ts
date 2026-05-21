import test from "node:test";
import assert from "node:assert";
import { getCTRScore } from "./scoring";

test("getCTRScore returns base score if no bonuses apply", () => {
  const score = getCTRScore("basic hook", "basic psychology", "five words in this text overlay");
  assert.strictEqual(score, 85);
});

test("getCTRScore adds bonus for curiosity hook", () => {
  const score = getCTRScore("curiosity gap", "basic psychology", "five words in this text overlay");
  assert.strictEqual(score, 90);
});

test("getCTRScore maxes out at 99", () => {
  const score = getCTRScore("curiosity gap", "shock value", "three words only");
  // 85 + 5 + 3 + 5 = 98
  assert.strictEqual(score, 98);
});
