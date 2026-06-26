## Plan Draft
1. **Analyze:** We need to do a daily task upgrade loop.
2. **Audit & Research:**
- The project is a YouTube thumbnail concept generator using Gemini (concepts) and Minimax (images).
- `src/components/ThumbnailConceptCard.tsx` uses `any` heavily. It's missing `ImageEditState` type or equivalent, and imports of `ThumbnailConcept` and `StrategistResponse` are available in `src/services/gemini.ts`.
- `server.ts` uses `any` for express types.
- The `getCTRScore` function is duplicated in `src/App.tsx` and somewhat tightly coupled with `ThumbnailConceptCard` via props. It could be moved to a shared utility file `src/utils/scoring.ts` to improve testability and reduce clutter in `App.tsx`.
- We could create `src/types.ts` to hold `ImageEditState` and export `ThumbnailConcept` to avoid circular dependencies or keep them in `src/services/gemini.ts`.
- Let's do a targeted refactoring to eliminate `any` from `src/components/ThumbnailConceptCard.tsx` and move types to `src/types.ts`. This improves code quality, type safety, and satisfies the daily upgrade goals.

**Priority:** Technical debt blocking future progress/Missing type safety.
**Chosen Task:** Refactor `src/components/ThumbnailConceptCard.tsx` to use strong typing, eliminate `any`, extract shared types into `src/types.ts`, and extract `getCTRScore` to a utility file.
