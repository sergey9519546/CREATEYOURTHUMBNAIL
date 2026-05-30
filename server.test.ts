import { test, describe, after, mock, before } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';

// Set NODE_ENV before importing server
process.env.NODE_ENV = 'test';

describe('Server Initialization', () => {
  let app: any;
  let originalFetch: typeof fetch;

  before(async () => {
    // Dynamic import to ensure NODE_ENV is set before server evaluation
    const serverModule = await import('./server.js');
    app = await serverModule.createServerApp();

    originalFetch = global.fetch;
    global.fetch = async (input, init) => {
      // Mock successful Gemini response
      if (input.toString().includes('thumbnail-concepts') || input.toString().includes('gemini')) {
        return new Response(JSON.stringify({
          video_context_summary: "mock",
          niche_applied: "mock",
          style_preset_applied: "mock",
          thumbnails: [],
          optimization_notes: "mock",
          chat_prompt: "mock"
        }), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    };
  });

  after(() => {
    global.fetch = originalFetch;
  });

  test('should initialize the server app successfully', () => {
    assert.ok(app);
  });

  test('should return 429 when rate limited', async () => {
    const request = supertest(app);

    // The thumbnail-concepts endpoint has a rate limit of 10 requests per minute per IP.
    for (let i = 0; i < 10; i++) {
      await request.post('/api/thumbnail-concepts').send({ idea: 'test idea' });
    }

    // The 11th request should be rate limited.
    const res = await request.post('/api/thumbnail-concepts').send({ idea: 'test idea' });
    assert.strictEqual(res.status, 429);
    assert.strictEqual(res.body.error, 'Too many requests — please wait a minute before trying again.');
  });
});
