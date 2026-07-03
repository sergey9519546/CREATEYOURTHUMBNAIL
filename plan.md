1. **Analyze**: The project is a YouTube thumbnail concept generator (React, Vite, Express, Google GenAI/Minimax). It helps users ideate thumbnails, applying niches, styles, and API-generated images.
2. **Audit**:
    - The repository is messy: `App.tsx` is over 800 lines. `App.tsx` has logic mixing state, UI, API fetch, and utility components (e.g. `SettingsDrawer`, `getCTRScore`).
    - `ThumbnailConceptCard.tsx` uses `any` for props (e.g., `concept: any`).
    - Storage logic (e.g., `localStorage`) does not use a central wrapper and handles exceptions poorly in `App.tsx` resulting in duplication.
    - `server.ts` uses inline `getSystemInstruction` with file system reads per cached operation.
    - Lack of tests (`src/**/*.test.ts` ran 0 tests).
3. **Research**:
    - In Vite, we should maintain strong type safety. React state management and type extractions (`types.ts`) are necessary for `ThumbnailConceptCard` avoiding `any`.
    - Local storage can throw quota errors or access exceptions. Centralized `safeStorage` is an industry best practice.
4. **Innovate**:
    - The highest leverage upgrade today is a refactor and polish pass to eliminate `any` types, extract logic (`types.ts`, `storage.ts`, `scoring.ts`), write unit tests for the extracted logic (`node:test` + `node:assert`), and centralize error handling. This solves technical debt and missing type safety.
5. **Prioritize**:
    - Improve codebase architecture and type safety by creating `src/types.ts` and extracting core business logic/utilities (e.g. `getCTRScore`, `getRefinementSuggestions`, `safeStorage`) into `src/utils/`. Eliminate `any` in `ThumbnailConceptCardProps`. Add unit tests.
