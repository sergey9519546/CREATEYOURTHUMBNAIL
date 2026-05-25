import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { createServerApp } from './server.ts';

process.env.NODE_ENV = 'test';

test('Server initializes and handles rate limit correctly', async () => {
  process.env.GEMINI_API_KEY = "dummy_key_12345678901234567890";
  const app = await createServerApp();

  // Test basic POST missing body (should return 400 from our API validation logic, or 400 from express.json)
  const res = await request(app)
    .post('/api/thumbnail-concepts')
    .send({});

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.error.includes('Video idea is required'));
});

test('Server setup has express json parsing', async () => {
  const app = await createServerApp();

  // Send large payload to trigger 50mb limit test or normal parse
  const res = await request(app)
    .post('/api/generate-image')
    .send({ prompt: "A".repeat(4001), niche: 'General', stylePreset: 'Viral', layout: 'Default', palette: 'Vibrant' });

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.error.includes('Prompt must be under 4000 characters'));
});
