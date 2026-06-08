import test from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement.js";

test("getRefinementSuggestions generation", () => {
  const suggestions = getRefinementSuggestions("number", "curiosity");
  assert.ok(suggestions.length <= 6, "Should return at most 6 suggestions");
  assert.ok(suggestions.includes("Make the number glow to increase focus"), "Should include specific number/curiosity suggestion");
});
