<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CreateYourThumbnail

AI-powered YouTube thumbnail concept generator. Describe your video, get multiple thumbnail concepts with generated images, and refine them interactively.

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your API keys:
   ```
   cp .env.example .env
   ```
   - `GEMINI_API_KEY` — Google Gemini API key (for concept generation)
   - `MINIMAX_API_KEY` — Minimax API key (for image generation)

3. Run the app:
   ```
   npm run dev
   ```

The app runs at `http://localhost:3000` by default.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | TypeScript type check |
