import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { createServerApp } from './server';

describe('Server API Routes', () => {
  let app: any;

  before(async () => {
    process.env.NODE_ENV = 'test';
    process.env.GEMINI_API_KEY = 'test-gemini-key-with-sufficient-length';
    process.env.MINIMAX_API_KEY = 'test-minimax-key';
    app = await createServerApp();
  });

  after(() => {
    delete process.env.NODE_ENV;
    delete process.env.GEMINI_API_KEY;
    delete process.env.MINIMAX_API_KEY;
    // Vite middleware hangs the test, so we have to exit forcefully if it's there
    process.exit(0);
  });

  test('POST /api/thumbnail-concepts requires idea', async () => {
    const res = await request(app).post('/api/thumbnail-concepts').send({});
    assert.strictEqual(res.statusCode, 400);
    assert.match(res.body.error, /Video idea is required/);
  });
});
