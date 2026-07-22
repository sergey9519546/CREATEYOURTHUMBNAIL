The goal of this task is to perform a daily improvement task.
After analyzing the repo, a key improvement area is removing `any` types and establishing a shared `types.ts` file for centralizing definitions like `ImageEditState`, `ThumbnailConcept`, and `StrategistResponse`.

### My Plan:
1. Extract `ThumbnailConcept` and `StrategistResponse` from `src/services/gemini.ts` into a new file `src/types.ts`.
2. Also move `ImageEditState` interface out of `App.tsx` and into `src/types.ts`.
3. Update `src/services/gemini.ts` to import these types from `src/types.ts` and re-export them.
4. Update `src/App.tsx` to import `ImageEditState` and use it for `useState<Record<number, ImageEditState>>`.
5. Update `src/components/ThumbnailConceptCard.tsx` to import `ThumbnailConcept`, `StrategistResponse`, and `ImageEditState` and replace all `any` usages with proper types.
6. Check `server.ts` to replace `any` in middleware (`req`, `res`, `next` -> `Request`, `Response`, `NextFunction` from `express`) and catch clauses (`error: any` -> `unknown` with casting). Also handle response bodies cast to `any`.
7. Verify functionality with `npm run lint` and `npm run build`.
8. Complete pre-commit checks and submit.
