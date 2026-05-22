import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { ErrorBoundary } from "./ErrorBoundary";

GlobalRegistrator.register();

// Suppress console.error in tests
const originalConsoleError = console.error;

beforeEach(() => {
  console.error = () => {};
});

afterEach(() => {
  console.error = originalConsoleError;
  cleanup();
});

const Bomb = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Kaboom!");
  }
  return <div>Safe</div>;
};

test("ErrorBoundary renders children when there is no error", () => {
  const { getByText } = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );
  assert.ok(getByText("Safe"));
});

test("ErrorBoundary catches error and displays fallback UI", () => {
  const { getByText } = render(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>
  );

  assert.ok(getByText("Something went wrong"));
  assert.ok(getByText("Kaboom!"));
});

test("ErrorBoundary can recover from error when Try Again is clicked", () => {
  const { getByText, rerender } = render(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>
  );

  // It should show error
  assert.ok(getByText("Kaboom!"));

  // Update props to safe component first so next render will be safe
  rerender(
    <ErrorBoundary>
      <Bomb shouldThrow={false} />
    </ErrorBoundary>
  );

  // Click try again to clear the error boundary state
  fireEvent.click(getByText("Try Again"));

  // Should show safe content
  assert.ok(getByText("Safe"));
});
