import { test } from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement.js";

test("getRefinementSuggestions returns fallback suggestions when no match", () => {
  const suggestions = getRefinementSuggestions("normal", "normal");
  assert.strictEqual(suggestions.length, 5);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});

test("getRefinementSuggestions returns specific suggestions for curiosity and number", () => {
  const suggestions = getRefinementSuggestions("has a number", "shows curiosity");
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.length <= 6);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});
