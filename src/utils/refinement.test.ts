import test from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement.js";

test("getRefinementSuggestions returns default suggestions if no match", () => {
  const suggestions = getRefinementSuggestions("normal hook", "normal psychology");
  assert.strictEqual(suggestions.length > 0, true);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test("getRefinementSuggestions handles specific combinations", () => {
  const suggestions = getRefinementSuggestions("number", "curiosity");
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});
