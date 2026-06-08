import test from "node:test";
import assert from "node:assert";
import { getCTRScore } from "./ctr.js";
import { ThumbnailConcept } from "../services/gemini.js";

test("getCTRScore calculations", () => {
  const baseConcept = {
    concept_number: 1,
    concept_name: "Test",
    hook: "normal",
    layout: "default",
    text_overlay: "one two three four five",
    color_strategy: "red",
    psychology: "normal",
    ctr_explanation: "test",
    image_generation_prompt: "test"
  } as ThumbnailConcept;

  assert.strictEqual(getCTRScore(baseConcept), 85, "Base score is 85");
  assert.strictEqual(getCTRScore({ ...baseConcept, hook: "curiosity gap" }), 90, "curiosity hook +5");
  assert.strictEqual(getCTRScore({ ...baseConcept, psychology: "shock and awe" }), 88, "shock psychology +3");
  assert.strictEqual(getCTRScore({ ...baseConcept, text_overlay: "one two three four" }), 90, "short text +5");
  assert.strictEqual(getCTRScore({ ...baseConcept, hook: "curiosity", psychology: "shock", text_overlay: "short" }), 98, "all conditions +13");
});
