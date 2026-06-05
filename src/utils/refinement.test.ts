import { test } from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement.js";

test("getRefinementSuggestions should return suggestions for curiosity and mystery", () => {
  const suggestions = getRefinementSuggestions("hook", "curiosity");
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
});

test("getRefinementSuggestions should handle comparison hook with fear", () => {
  const suggestions = getRefinementSuggestions("comparison", "fear");
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a red border for urgency"));
});

test("getRefinementSuggestions should handle storytelling hook", () => {
  const suggestions = getRefinementSuggestions("storytelling", "normal");
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Add a narrative element to the background"));
});

test("getRefinementSuggestions should return defaults when empty", () => {
  const suggestions = getRefinementSuggestions("normal", "normal");
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
});
