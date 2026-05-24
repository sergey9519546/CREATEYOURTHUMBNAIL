import { test, describe, before, mock, after } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { createApp } from "./server.ts";

describe("Server endpoints", () => {
  let app: any;
  let originalFetch: typeof global.fetch;

  before(async () => {
    // We set dummy API keys so it doesn't fail right away
    process.env.GEMINI_API_KEY = "test_gemini_key_123456789012345678901234567890";
    process.env.MINIMAX_API_KEY = "test_minimax_key";

    app = await createApp();
    originalFetch = global.fetch;
  });

  after(() => {
    global.fetch = originalFetch;
  });

  test("POST /api/thumbnail-concepts should return 400 if idea is missing", async () => {
    const response = await request(app)
      .post("/api/thumbnail-concepts")
      .send({ niche: "Gaming" });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "Video idea is required.");
  });

  test("POST /api/thumbnail-concepts should return 400 if idea is too long", async () => {
    const response = await request(app)
      .post("/api/thumbnail-concepts")
      .send({ idea: "a".repeat(2001) });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "Video idea must be under 2000 characters.");
  });

  test("POST /api/thumbnail-concepts should return 200 with mocked Google API", async () => {
    const mockGoogleResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  video_context_summary: "Context",
                  niche_applied: "Gaming",
                  style_preset_applied: "Adventure",
                  thumbnails: [{
                    concept_number: 1,
                    concept_name: "Mock Concept",
                    hook: "Hook",
                    layout: "Layout",
                    text_overlay: "Text",
                    color_strategy: "Color",
                    psychology: "Psych",
                    ctr_explanation: "CTR",
                    image_generation_prompt: "Prompt"
                  }],
                  optimization_notes: "Notes",
                  chat_prompt: "Chat"
                })
              }
            ]
          }
        }
      ]
    };

    global.fetch = async (url: any, options: any) => {
      // Mock for generateContent
      if (url.toString().includes("generateContent")) {
        return new Response(JSON.stringify(mockGoogleResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return originalFetch(url, options);
    };

    const response = await request(app)
      .post("/api/thumbnail-concepts")
      .send({
        idea: "test video",
        niche: "Gaming",
        stylePreset: "Adventure",
        layout: "Default",
        palette: "Vibrant"
      });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.niche_applied, "Gaming");
    assert.strictEqual(response.body.thumbnails[0].concept_name, "Mock Concept");

    // reset fetch
    global.fetch = originalFetch;
  });
});
