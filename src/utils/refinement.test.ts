import test from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement";

test("getRefinementSuggestions - curiosity and number", () => {
  const result = getRefinementSuggestions("Number", "Curiosity");
  assert.ok(result.includes("Make the number glow to increase focus"));
});

test("getRefinementSuggestions - default suggestions", () => {
  const result = getRefinementSuggestions("generic", "bland");
  assert.ok(result.includes("Increase text size for mobile readability"));
});
