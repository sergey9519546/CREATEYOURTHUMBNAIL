import test, { describe } from "node:test";
import assert from "node:assert";
import { getCTRScore } from "./scoring.js";
import { ThumbnailConcept } from "../services/gemini.js";

describe("getCTRScore", () => {
  const baseConcept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: "test",
    hook: "normal hook",
    layout: "Default",
    text_overlay: "one two three four five",
    color_strategy: "Vibrant",
    psychology: "normal psychology",
    ctr_explanation: "test",
    image_generation_prompt: "test"
  };

  test("returns base score 85 when no bonuses apply", () => {
    assert.strictEqual(getCTRScore(baseConcept), 85);
  });

  test("adds 5 points for curiosity hook", () => {
    assert.strictEqual(getCTRScore({ ...baseConcept, hook: "Curiosity gap here" }), 90);
  });

  test("adds 3 points for shock psychology", () => {
    assert.strictEqual(getCTRScore({ ...baseConcept, psychology: "Shock value" }), 88);
  });

  test("adds 5 points for short text overlay", () => {
    assert.strictEqual(getCTRScore({ ...baseConcept, text_overlay: "Short text here" }), 90);
  });

  test("caps score at 99", () => {
    const perfectConcept = {
      ...baseConcept,
      hook: "curiosity",
      psychology: "shock",
      text_overlay: "short text"
    };
    // 85 + 5 + 3 + 5 = 98 -> should be 98
    assert.strictEqual(getCTRScore(perfectConcept), 98);
  });
});
