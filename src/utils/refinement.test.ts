import test from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement.js";

test("getRefinementSuggestions - Curiosity + Number", () => {
  const suggestions = getRefinementSuggestions("number habits", "curiosity");
  assert.ok(suggestions.includes("Make the number glow to increase focus"));
  assert.ok(suggestions.includes("Use a '?' instead of a digit to amplify mystery"));
});

test("getRefinementSuggestions - Fear + Comparison", () => {
  const suggestions = getRefinementSuggestions("comparison vs after", "fear");
  assert.ok(suggestions.includes("Make the 'bad' side darker to increase contrast"));
  assert.ok(suggestions.includes("Add a warning sign to the 'bad' side"));
});

test("getRefinementSuggestions - Joy + Storytelling", () => {
  const suggestions = getRefinementSuggestions("my crazy storytelling", "joy");
  assert.ok(suggestions.includes("Add a bright, happy background"));
  assert.ok(suggestions.includes("Make the subject's expression more ecstatic"));
});

test("getRefinementSuggestions - Fallback logic when no specific keywords match", () => {
  const suggestions = getRefinementSuggestions("generic hook", "calm");
  assert.ok(suggestions.includes("Increase text size for mobile readability"));
  assert.ok(suggestions.includes("Boost subject brightness by 20%"));
});

test("getRefinementSuggestions - Combination logic", () => {
  const suggestions = getRefinementSuggestions("comparison", "controversy");
  assert.ok(suggestions.includes("Use a more confrontational pose"));
  assert.ok(suggestions.includes("Add a split-screen divider for clear story separation"));
});

test("getRefinementSuggestions - Maximum 6 suggestions returned", () => {
  const suggestions = getRefinementSuggestions("number comparison versus storytelling narrative expert listicle", "curiosity fear joy excitement mystery urgency controversy");
  assert.strictEqual(suggestions.length, 6);
});

test("getRefinementSuggestions - Case insensitivity", () => {
  const suggestionsUpper = getRefinementSuggestions("5 HABITS", "CURIOSITY");
  const suggestionsLower = getRefinementSuggestions("5 habits", "curiosity");
  assert.deepStrictEqual(suggestionsUpper, suggestionsLower);
});
