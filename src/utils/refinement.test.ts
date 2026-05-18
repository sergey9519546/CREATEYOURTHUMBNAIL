import test from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement";

test("getRefinementSuggestions - curiosity and number", () => {
  const suggestions = getRefinementSuggestions("number", "curiosity");
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
});

test("getRefinementSuggestions - fear and comparison", () => {
  const suggestions = getRefinementSuggestions("comparison", "fear");
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
});

test("getRefinementSuggestions - fallback logic", () => {
  const suggestions = getRefinementSuggestions("unknown_hook", "unknown_psychology");
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
});

test("getRefinementSuggestions - size constraint", () => {
  const suggestions = getRefinementSuggestions("number", "curiosity");
  assert.ok(suggestions.length <= 6, "Should return at most 6 suggestions");
});
