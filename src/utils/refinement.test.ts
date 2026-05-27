import test from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement.js";

test("getRefinementSuggestions - curiosity and number", () => {
  const suggestions = getRefinementSuggestions("number", "curiosity");
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus") || suggestions.includes("Add a '?' to the text to drive clicks"));
});

test("getRefinementSuggestions - fallback", () => {
  const suggestions = getRefinementSuggestions("unknown", "unknown");
  assert.strictEqual(suggestions.length, 5);
  assert.strictEqual(suggestions[0], "Increase text size for mobile readability");
});
