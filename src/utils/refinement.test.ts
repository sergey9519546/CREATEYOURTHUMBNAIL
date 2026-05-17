import test from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement";

test("getRefinementSuggestions returns default suggestions when no match", () => {
  const suggestions = getRefinementSuggestions("random hook", "random psychology");
  assert.strictEqual(suggestions.length, 5);
  assert.strictEqual(suggestions[0], "Increase text size for mobile readability");
});

test("getRefinementSuggestions handles curiosity and number", () => {
  const suggestions = getRefinementSuggestions("number", "curiosity");
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});
