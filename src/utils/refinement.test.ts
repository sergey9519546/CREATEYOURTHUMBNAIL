import { test, describe } from "node:test";
import assert from "node:assert";
import { getRefinementSuggestions } from "./refinement.js";

describe("getRefinementSuggestions", () => {
  test("returns suggestions for curiosity and number", () => {
    const suggestions = getRefinementSuggestions("Number", "Curiosity");
    assert(suggestions.some(s => s.includes("glow to increase focus")));
    assert(suggestions.some(s => s.includes("'?' instead of a digit")));
    assert(suggestions.length <= 6);
  });

  test("returns suggestions for fear and comparison", () => {
    const suggestions = getRefinementSuggestions("Comparison", "Fear");
    assert(suggestions.some(s => s.includes("darker to increase contrast")));
    assert(suggestions.some(s => s.includes("Add a warning sign")));
    assert(suggestions.length <= 6);
  });

  test("returns default suggestions when no match", () => {
    const suggestions = getRefinementSuggestions("Unknown Hook", "Unknown Psychology");
    assert(suggestions.some(s => s.includes("Increase text size")));
    assert(suggestions.some(s => s.includes("Simplify the background")));
    assert(suggestions.length === 5); // 5 default suggestions
  });

  test("returns max 6 suggestions even with multiple matches", () => {
    // Both fear and comparison match
    const suggestions = getRefinementSuggestions("Comparison", "Fear");
    assert(suggestions.length <= 6);
  });
});
