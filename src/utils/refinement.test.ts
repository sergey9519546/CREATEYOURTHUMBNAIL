import { test } from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement.js";

test("getRefinementSuggestions - curiosity and number hook", () => {
  const suggestions = getRefinementSuggestions("number", "curiosity");
  assert.strictEqual(suggestions.length > 0, true);
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
});

test("getRefinementSuggestions - fear and comparison hook", () => {
  const suggestions = getRefinementSuggestions("comparison", "fear");
  assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
});

test("getRefinementSuggestions - fallback suggestions", () => {
  const suggestions = getRefinementSuggestions("random", "nothing");
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
