import { test } from "node:test";
import assert from "node:assert";
import { sanitizeError } from "./errorHandling.ts";

test("sanitizeError - extracts message from error object", () => {
  const result = sanitizeError(new Error("Standard error message"));
  assert.strictEqual(result, "Standard error message");
});

test("sanitizeError - defaults to 'Unknown error' if no message", () => {
  const result = sanitizeError({});
  assert.strictEqual(result, "Unknown error");
});

test("sanitizeError - identifies Gemini API quota exceeded (spending cap)", () => {
  const result = sanitizeError(new Error("Error: spending cap reached"));
  assert.strictEqual(
    result,
    "Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com."
  );
});

test("sanitizeError - identifies Gemini API quota exceeded (RESOURCE_EXHAUSTED)", () => {
  const result = sanitizeError(new Error("status: RESOURCE_EXHAUSTED"));
  assert.strictEqual(
    result,
    "Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com."
  );
});

test("sanitizeError - identifies invalid API key (API_KEY_INVALID)", () => {
  const result = sanitizeError(new Error("API_KEY_INVALID provided"));
  assert.strictEqual(
    result,
    "Invalid API key. Please check your environment configuration."
  );
});

test("sanitizeError - identifies invalid API key (not valid)", () => {
  const result = sanitizeError(new Error("The key is not valid"));
  assert.strictEqual(
    result,
    "Invalid API key. Please check your environment configuration."
  );
});

test("sanitizeError - identifies invalid API key (API key)", () => {
  const result = sanitizeError(new Error("API key is required"));
  assert.strictEqual(
    result,
    "Invalid API key. Please check your environment configuration."
  );
});

test("sanitizeError - identifies missing MINIMAX_API_KEY", () => {
  const result = sanitizeError(new Error("MINIMAX_API_KEY environment variable missing"));
  assert.strictEqual(
    result,
    "Image generation is not configured. MINIMAX_API_KEY is missing."
  );
});

test("sanitizeError - strips URLs", () => {
  const result = sanitizeError(new Error("Failed request to https://api.example.com/data"));
  assert.strictEqual(result, "Failed request to [url]");
});

test("sanitizeError - keeps only the first line", () => {
  const result = sanitizeError(new Error("First line\nSecond line\nThird line"));
  assert.strictEqual(result, "First line");
});

test("sanitizeError - truncates to 300 characters", () => {
  const longMessage = "A".repeat(500);
  const result = sanitizeError(new Error(longMessage));
  assert.strictEqual(result.length, 300);
  assert.strictEqual(result, "A".repeat(300));
});

test("sanitizeError - handles undefined gracefully", () => {
  const result = sanitizeError(undefined);
  assert.strictEqual(result, "Unknown error");
});

test("sanitizeError - handles null gracefully", () => {
  const result = sanitizeError(null);
  assert.strictEqual(result, "Unknown error");
});

test("sanitizeError - handles strings gracefully", () => {
  const result = sanitizeError("Just a string error"); // Although type says any, typical usage might pass strings occasionally
  // It checks err?.message, so for string it will fall to "Unknown error" which is fine for its current implementation
  assert.strictEqual(result, "Unknown error");
});
