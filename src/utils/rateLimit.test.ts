import test from "node:test";
import assert from "node:assert";
import { rateLimit, ipWindows } from "./rateLimit.js";

test("rateLimit middleware allows requests under the limit", () => {
  ipWindows.clear();
  const req = { headers: { "x-forwarded-for": "1.2.3.4" }, ip: "1.2.3.4" };
  const res = { status: () => ({ json: () => {} }) };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  const middleware = rateLimit(2);

  middleware(req, res, next);
  assert.strictEqual(nextCalled, true, "First request should be allowed");
  nextCalled = false;

  middleware(req, res, next);
  assert.strictEqual(nextCalled, true, "Second request should be allowed");
});

test("rateLimit middleware blocks requests over the limit", () => {
  ipWindows.clear();
  const req = { headers: { "x-forwarded-for": "1.2.3.4" }, ip: "1.2.3.4" };
  let jsonCalled = false;
  let statusCode = 0;
  const res = {
    status: (code: number) => {
      statusCode = code;
      return {
        json: () => { jsonCalled = true; }
      };
    }
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  const middleware = rateLimit(1);

  // First request
  middleware(req, res, next);
  assert.strictEqual(nextCalled, true, "First request should be allowed");
  nextCalled = false;

  // Second request should be blocked
  middleware(req, res, next);
  assert.strictEqual(nextCalled, false, "Second request should not call next()");
  assert.strictEqual(statusCode, 429, "Should set status to 429");
  assert.strictEqual(jsonCalled, true, "Should return JSON error response");
});

test("rateLimit middleware resets limit after the window expires", () => {
  ipWindows.clear();
  const req = { headers: { "x-forwarded-for": "1.2.3.4" }, ip: "1.2.3.4" };
  const res = { status: () => ({ json: () => {} }) };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  const middleware = rateLimit(1);

  middleware(req, res, next);
  assert.strictEqual(nextCalled, true, "First request should be allowed");
  nextCalled = false;

  // Manually manipulate the reset time to simulate expiration
  const win = ipWindows.get("1.2.3.4");
  if (win) {
    win.resetAt = Date.now() - 1000; // Expired 1 second ago
  }

  // Next request should be allowed again
  middleware(req, res, next);
  assert.strictEqual(nextCalled, true, "Request after expiration should be allowed");
});

test("rateLimit middleware handles missing headers and uses req.ip", () => {
  ipWindows.clear();
  const req = { headers: {}, ip: "5.6.7.8" };
  const res = { status: () => ({ json: () => {} }) };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  const middleware = rateLimit(1);

  middleware(req, res, next);
  assert.strictEqual(nextCalled, true);
  assert.ok(ipWindows.has("5.6.7.8"), "Should track by req.ip if x-forwarded-for is missing");
});

test("rateLimit middleware handles missing headers and req.ip by using 'unknown'", () => {
  ipWindows.clear();
  const req = { headers: {} };
  const res = { status: () => ({ json: () => {} }) };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  const middleware = rateLimit(1);

  middleware(req, res, next);
  assert.strictEqual(nextCalled, true);
  assert.ok(ipWindows.has("unknown"), "Should fallback to 'unknown'");
});
