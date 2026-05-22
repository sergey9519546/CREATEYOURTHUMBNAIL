import { test } from "node:test";
import assert from "node:assert";
import { getCTRScore } from "./ctr.js";
import { ThumbnailConcept } from "../services/gemini.js";

test("getCTRScore calculates base score", () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: "Test",
    hook: "normal",
    layout: "normal",
    text_overlay: "one two three four five",
    color_strategy: "normal",
    psychology: "normal",
    ctr_explanation: "normal",
    image_generation_prompt: "normal"
  };

  assert.strictEqual(getCTRScore(concept), 85);
});

test("getCTRScore increases for curiosity hook", () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: "Test",
    hook: "curiosity gap",
    layout: "normal",
    text_overlay: "one two three four five",
    color_strategy: "normal",
    psychology: "normal",
    ctr_explanation: "normal",
    image_generation_prompt: "normal"
  };

  assert.strictEqual(getCTRScore(concept), 90);
});

test("getCTRScore increases for shock psychology", () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: "Test",
    hook: "normal",
    layout: "normal",
    text_overlay: "one two three four five",
    color_strategy: "normal",
    psychology: "shock value",
    ctr_explanation: "normal",
    image_generation_prompt: "normal"
  };

  assert.strictEqual(getCTRScore(concept), 88);
});

test("getCTRScore increases for short text overlay", () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: "Test",
    hook: "normal",
    layout: "normal",
    text_overlay: "short text only",
    color_strategy: "normal",
    psychology: "normal",
    ctr_explanation: "normal",
    image_generation_prompt: "normal"
  };

  assert.strictEqual(getCTRScore(concept), 90);
});

test("getCTRScore caps at 99", () => {
  const concept: ThumbnailConcept = {
    concept_number: 1,
    concept_name: "Test",
    hook: "curiosity",
    layout: "normal",
    text_overlay: "short text",
    color_strategy: "normal",
    psychology: "shock",
    ctr_explanation: "normal",
    image_generation_prompt: "normal"
  };

  assert.strictEqual(getCTRScore(concept), 98);

  // Base 85 + 5 (curiosity) + 3 (shock) + 5 (short text) = 98
});
