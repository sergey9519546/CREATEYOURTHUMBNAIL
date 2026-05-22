import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from './server.ts';

test('POST /api/thumbnail-concepts rejects idea over 2000 characters', async () => {
  const longIdea = 'a'.repeat(2001);
  const response = await request(app)
    .post('/api/thumbnail-concepts')
    .send({ idea: longIdea });

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, 'Video idea must be under 2000 characters.');
});

test('POST /api/thumbnail-concepts rejects missing idea', async () => {
  const response = await request(app)
    .post('/api/thumbnail-concepts')
    .send({});

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, 'Video idea is required.');
});

test('POST /api/thumbnail-concepts rejects empty idea', async () => {
  const response = await request(app)
    .post('/api/thumbnail-concepts')
    .send({ idea: '   ' });

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, 'Video idea is required.');
});

test('POST /api/thumbnail-concepts rejects non-array likedConcepts', async () => {
  const response = await request(app)
    .post('/api/thumbnail-concepts')
    .send({ idea: 'valid idea', likedConcepts: 'not-an-array' });

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, 'likedConcepts must be an array.');
});

test('POST /api/thumbnail-concepts rejects too many likedConcepts', async () => {
  const tooManyConcepts = Array(21).fill('concept');
  const response = await request(app)
    .post('/api/thumbnail-concepts')
    .send({ idea: 'valid idea', likedConcepts: tooManyConcepts });

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, 'Too many liked concepts (max 20).');
});
