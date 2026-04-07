# habit-coach-web

## What this is

**Habit Coach** is a habit-tracking product: users manage **habits**, log **daily check-ins**, see **streaks** and **weekly summaries**, and (as the product grows) optional **reminders**. This repo is the **Next.js** app: dashboards, forms, and charts that talk to the backend **only via GraphQL** (Apollo Client). It does not own business rules that belong in the API (e.g. streak math)—it reflects the contract and presents data clearly.

## Read order (agents)

1. **[CODE_LAYOUT.md](./CODE_LAYOUT.md)** — where new files go; keep `app/` thin.
2. **Full-stack plan + phases:** [habit-coach-api `PROJECT_PLAN.md`](https://github.com/GeorgiDS9/habit-coach-api/blob/main/PROJECT_PLAN.md)  
   **Local (sibling clones):** `../habit-coach-api/PROJECT_PLAN.md`
3. **Architecture & flows:** [habit-coach-api `ARCHITECTURE_FLOWS.md`](https://github.com/GeorgiDS9/habit-coach-api/blob/main/ARCHITECTURE_FLOWS.md)  
   **Local:** `../habit-coach-api/ARCHITECTURE_FLOWS.md` — system overview, auth sequence, ER diagram, data flow, FE component tree.
4. Optional repo notes: [AGENTS.md](./AGENTS.md)

## Testing

Run before every push or merge — CI must not be the first to catch failures.

```bash
npm test          # vitest (RTL unit tests, jsdom)
npm run typecheck # tsc --noEmit
npm run build     # Next.js production build — catches runtime-visible type gaps
```

Run `npm run test:e2e` only when the API is running locally (requires `habit-coach-api` on `:4000`).

**Test hygiene rules:**
- Never hardcode dates in tests (e.g. `"2026-04-04"`). Use `new Date().toISOString().slice(0, 10)` for "today". Hardcoded dates rot silently and only fail in CI weeks later.

## Contract

When **`habit-coach-api`** GraphQL schema or operations change, update this app (operations, codegen types, env, UI) in the **same** slice unless the task is explicitly backend-only.

## Git

Do NOT add `Co-Authored-By` trailers to commit messages.

**Default:** branches (`feat/…`, `fix/…`, `chore/…`), several meaningful commits (do separation of concerns, do not bundle up all changes into just 1 or 2 commits); **push**, then **merge into `main`** (`git checkout main && git merge <branch> && git push origin main`) — no PR workflow. **Exception:** trivial doc-only fixes on `main`. **Cross-repo:** merge both repos in a sensible order; note the dependency in a commit message if helpful. Same rules apply in `habit-coach-api`.
