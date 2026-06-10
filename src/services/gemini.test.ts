import test from 'node:test';
import assert from 'node:assert';
import { getThumbnailConcepts, refineConcept, generateThumbnailImage, ThumbnailConcept } from './gemini.js';

const originalFetch = global.fetch;

test('handleGeminiError throws RESOURCE_EXHAUSTED', async (t) => {
  t.after(() => {
    global.fetch = originalFetch;
  });
    global.fetch = async () => {
      return {
        ok: false,
        json: async () => ({ error: 'Error RESOURCE_EXHAUSTED' })
      } as Response;
    };

    try {
      await getThumbnailConcepts('idea', 'niche', 'style', 'layout', 'palette');
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.strictEqual(error.message, 'Gemini API Quota Exceeded: Your Google Cloud project has reached its spending cap or quota. Please check your billing settings at console.cloud.google.com.');
    }
});

test('handleGeminiError throws spending cap error', async (t) => {
  t.after(() => {
    global.fetch = originalFetch;
  });
    global.fetch = async () => {
      return {
        ok: false,
        json: async () => ({ error: 'spending cap reached' })
      } as Response;
    };

    const dummyConcept: ThumbnailConcept = {
      concept_number: 1,
      concept_name: 'test',
      hook: 'test',
      layout: 'test',
      text_overlay: 'test',
      color_strategy: 'test',
      psychology: 'test',
      ctr_explanation: 'test',
      image_generation_prompt: 'test',
    };

    try {
      await refineConcept(dummyConcept, 'feedback');
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.strictEqual(error.message, 'Gemini API Quota Exceeded: Your Google Cloud project has reached its spending cap or quota. Please check your billing settings at console.cloud.google.com.');
    }
});

test('handleGeminiError throws general error', async (t) => {
  t.after(() => {
    global.fetch = originalFetch;
  });
    global.fetch = async () => {
      return {
        ok: false,
        json: async () => ({ error: 'Something else went wrong' })
      } as Response;
    };

    try {
      await generateThumbnailImage('prompt', 'niche', 'style', 'layout', 'palette');
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.strictEqual(error.message, 'Something else went wrong');
    }
});

test('handleGeminiError defaults to generic unknown error message', async (t) => {
  t.after(() => {
    global.fetch = originalFetch;
  });
    global.fetch = async () => {
      return {
        ok: false,
        json: async () => ({})
      } as Response;
    };

    try {
      await generateThumbnailImage('prompt', 'niche', 'style', 'layout', 'palette');
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.strictEqual(error.message, 'An unknown error occurred');
    }
});
