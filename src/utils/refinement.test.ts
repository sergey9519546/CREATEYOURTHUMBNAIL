import { test } from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement";

test("getRefinementSuggestions - curiosity and number", () => {
  const suggestions = getRefinementSuggestions("Number", "Curiosity");
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test("getRefinementSuggestions - default fallback", () => {
  const suggestions = getRefinementSuggestions("unknown", "unknown");
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
