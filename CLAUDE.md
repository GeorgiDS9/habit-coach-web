# habit-coach-web

## What this is

**Habit Coach** is a habit-tracking product: users manage **habits**, log **daily check-ins**, see **streaks** and **weekly summaries**, and (as the product grows) optional **reminders**. This repo is the **Next.js** app: dashboards, forms, and charts that talk to the backend **only via GraphQL** (Apollo Client). It does not own business rules that belong in the API (e.g. streak math)—it reflects the contract and presents data clearly.

## Read order (agents)

1. **[CODE_LAYOUT.md](./CODE_LAYOUT.md)** — where new files go; keep `app/` thin.
2. **Full-stack plan + phases:** [habit-coach-api `PROJECT_PLAN.md`](https://github.com/GeorgiDS9/habit-coach-api/blob/main/PROJECT_PLAN.md)  
   **Local (sibling clones):** `../habit-coach-api/PROJECT_PLAN.md`
3. Optional repo notes: [AGENTS.md](./AGENTS.md)

## Contract

When **`habit-coach-api`** GraphQL schema or operations change, update this app (operations, codegen types, env, UI) in the **same** slice unless the task is explicitly backend-only.

## Git

Do NOT add `Co-Authored-By` trailers to commit messages.

**Default:** branches (`feat/…`, `fix/…`, `chore/…`), several meaningful commits (do separation of concerns, do not bundle up all changes intojust 1 or 2 commits), **push**, then **merge into `main`** (no PR workflow). **Exception:** trivial doc-only fixes on `main`. **Cross-repo:** merge both repos in a sensible order; mention the pairing in a commit message if helpful. Same rules: `habit-coach-api` / [PROJECT_PLAN.md](https://github.com/GeorgiDS9/habit-coach-api/blob/main/PROJECT_PLAN.md).
