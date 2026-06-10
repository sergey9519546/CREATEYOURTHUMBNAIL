import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { Express } from 'express';
import { createServerApp } from '../server.js';

let app: Express;
let originalFetch: typeof global.fetch;

test.before(async () => {
  // Save original fetch
  originalFetch = global.fetch;

  // Set required API keys to prevent initial checks from failing
  process.env.MINIMAX_API_KEY = 'test-minimax-key';
  process.env.GEMINI_API_KEY = 'test-gemini-key-with-sufficient-length-to-pass-validation';

  // Create app
  app = await createServerApp();
});

test.after(() => {
  // Restore original fetch
  global.fetch = originalFetch;
});

test('Rate limiter works and respects x-forwarded-for (trust proxy)', async (t) => {
  // The rate limit for thumbnail-concepts is 10 per minute
  // We will make 11 requests and the 11th should fail with 429

  // First, we mock fetch to prevent actual API calls during the first 10 requests
  global.fetch = async () => {
    return new Response(JSON.stringify({
      video_context_summary: "Test",
      niche_applied: "Test",
      style_preset_applied: "Test",
      thumbnails: [],
      optimization_notes: "Test",
      chat_prompt: "Test"
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  // Need to mock the GoogleGenAI instance behavior as it uses its own fetch implementation or similar internally
  // Actually, we don't need the request to succeed completely, just hit the rate limiter!
  // If it hits 400 (validation), it still counts against the rate limit. So we'll send invalid requests.

  let lastStatus = 200;
  for (let i = 0; i < 11; i++) {
    const res = await request(app)
      .post('/api/thumbnail-concepts')
      .set('x-forwarded-for', '1.2.3.4')
      .send({}); // Invalid request, should return 400

    lastStatus = res.status;
  }

  assert.strictEqual(lastStatus, 429, '11th request should return 429 Too Many Requests');
});

test('Trust proxy correctly identifies different IPs', async (t) => {
  // Since 1.2.3.4 is blocked, making a request with a different IP should succeed (or return 400, not 429)
  const res = await request(app)
    .post('/api/thumbnail-concepts')
    .set('x-forwarded-for', '5.6.7.8')
    .send({});

  assert.strictEqual(res.status, 400, 'Different IP should bypass rate limit of previous IP');
});

test('Endpoint validation - missing idea', async (t) => {
  const res = await request(app)
    .post('/api/thumbnail-concepts')
    .set('x-forwarded-for', '9.9.9.9')
    .send({ niche: 'General' });

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.error.includes('Video idea is required'));
});

test('Endpoint validation - idea too long', async (t) => {
  const res = await request(app)
    .post('/api/thumbnail-concepts')
    .set('x-forwarded-for', '10.10.10.10')
    .send({ idea: 'a'.repeat(2001) });

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.error.includes('Video idea must be under 2000 characters'));
});
