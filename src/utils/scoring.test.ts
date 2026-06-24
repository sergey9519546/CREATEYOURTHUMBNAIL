import test from "node:test";
import assert from "node:assert";
import { getCTRScore } from "./scoring.js";

test("getCTRScore base score and increments", () => {
  const baseConcept = {
    concept_number: 1,
    concept_name: "Test",
    hook: "Simple",
    layout: "Default",
    text_overlay: "One Two Three Four Five",
    color_strategy: "Red",
    psychology: "Neutral",
    ctr_explanation: "Test",
    image_generation_prompt: "Test"
  };
  assert.strictEqual(getCTRScore(baseConcept), 85);

  const curiosityConcept = { ...baseConcept, hook: "Curiosity test" };
  assert.strictEqual(getCTRScore(curiosityConcept), 90);

  const shockConcept = { ...baseConcept, psychology: "Shock effect" };
  assert.strictEqual(getCTRScore(shockConcept), 88);

  const shortTextConcept = { ...baseConcept, text_overlay: "One Two Three" };
  assert.strictEqual(getCTRScore(shortTextConcept), 90);

  const maxConcept = { ...baseConcept, hook: "Curiosity", psychology: "Shock", text_overlay: "Short text" };
  assert.strictEqual(getCTRScore(maxConcept), 98);
});
