import { test, describe, before, mock } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { createApp } from '../../server.js';

describe('POST /api/thumbnail-concepts', () => {
  let app: any;

  before(async () => {
    process.env.GEMINI_API_KEY = 'test_key_which_is_20_chars_long';
    app = await createApp();
  });

  test('should return 400 if idea is missing', async () => {
    const response = await request(app)
      .post('/api/thumbnail-concepts')
      .send({ niche: 'General' });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, 'Video idea is required.');
  });

  test('should return 400 if idea is over 2000 characters', async () => {
    const response = await request(app)
      .post('/api/thumbnail-concepts')
      .send({ idea: 'a'.repeat(2001) });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, 'Video idea must be under 2000 characters.');
  });

  test('should return 400 if likedConcepts is not an array', async () => {
    const response = await request(app)
      .post('/api/thumbnail-concepts')
      .send({ idea: 'test idea', likedConcepts: 'not an array' });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, 'likedConcepts must be an array.');
  });

  test('should return 400 if likedConcepts has more than 20 items', async () => {
    const response = await request(app)
      .post('/api/thumbnail-concepts')
      .send({ idea: 'test idea', likedConcepts: Array(21).fill('concept') });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, 'Too many liked concepts (max 20).');
  });

  test('should return 200 with generated concepts on success', async () => {
    // Mock global fetch since @google/genai uses it under the hood
    const originalFetch = global.fetch;
    const mockConcepts = {
      video_context_summary: "A test video",
      niche_applied: "General",
      style_preset_applied: "Adventure",
      thumbnails: [
        {
          concept_number: 1,
          concept_name: "Test Concept",
          hook: "A test hook",
          layout: "Default",
          text_overlay: "Test Text",
          color_strategy: "Vibrant",
          psychology: "Curiosity",
          ctr_explanation: "High contrast",
          image_generation_prompt: "A test image prompt"
        }
      ],
      optimization_notes: "Looks good",
      chat_prompt: "How can I improve this?"
    };

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = input.toString();
      if (urlStr.includes('generativelanguage.googleapis.com')) {
        return new Response(JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  { text: JSON.stringify(mockConcepts) }
                ]
              }
            }
          ]
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const response = await request(app)
        .post('/api/thumbnail-concepts')
        .send({ idea: 'test idea' });

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, mockConcepts);
    } finally {
      // Restore fetch
      global.fetch = originalFetch;
    }
  });

  test('should handle Gemini API rate limit properly', async () => {
    const originalFetch = global.fetch;

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = input.toString();
      if (urlStr.includes('generativelanguage.googleapis.com')) {
        return new Response(JSON.stringify({
          error: { message: 'RESOURCE_EXHAUSTED' }
        }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const response = await request(app)
        .post('/api/thumbnail-concepts')
        .send({ idea: 'test rate limit' });

      assert.strictEqual(response.status, 429);
      assert.ok(response.body.error.includes('quota exceeded'));
    } finally {
      // Restore fetch
      global.fetch = originalFetch;
    }
  });

  test('should handle malformed JSON response from Gemini', async () => {
    const originalFetch = global.fetch;

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = input.toString();
      if (urlStr.includes('generativelanguage.googleapis.com')) {
        return new Response(JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  { text: 'not valid json' }
                ]
              }
            }
          ]
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return originalFetch(input, init);
    };

    try {
      const response = await request(app)
        .post('/api/thumbnail-concepts')
        .send({ idea: 'test malformed json' });

      assert.strictEqual(response.status, 500);
      assert.strictEqual(response.body.error, 'AI returned malformed JSON — please try again');
    } finally {
      // Restore fetch
      global.fetch = originalFetch;
    }
  });
});
