import test from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement";

test("getRefinementSuggestions - curiosity and number", () => {
  const suggestions = getRefinementSuggestions("number", "curiosity");
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Add a '?' to the text to drive clicks"));
  assert.strictEqual(suggestions.length, 6);
});

test("getRefinementSuggestions - fear and comparison", () => {
  const suggestions = getRefinementSuggestions("before and after comparison", "fear");
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a red border for urgency"));
});

test("getRefinementSuggestions - joy and storytelling", () => {
  const suggestions = getRefinementSuggestions("my crazy storytelling adventure", "joy");
  assert.ok(suggestions.includes("Add a bright, happy background"));
  assert.ok(suggestions.includes("Increase color saturation to 100%"));
});

test("getRefinementSuggestions - no match fallback", () => {
  const suggestions = getRefinementSuggestions("boring video", "nothing");
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.strictEqual(suggestions.length, 5);
});

test("getRefinementSuggestions - controversy", () => {
  const suggestions = getRefinementSuggestions("some title", "controversy");
  assert.ok(suggestions.includes("Use a more confrontational pose"));
});
