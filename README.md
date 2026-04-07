# Habit Coach (Frontend)

Habit tracking application: manage habits, log check-ins, view streaks and progress.

## Prerequisites

- Node.js 20+
- A running instance of `habit-coach-api` (exposed on `:4000` by default).

## Setup

1. Copy `.env.example` to `.env.local`.
   ```bash
   cp .env.example .env.local
   ```
2. Set `NEXT_PUBLIC_GRAPHQL_URL` to your API URL (e.g., `http://localhost:4000/graphql`).
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

Sync schema and generate types:
```bash
npm run codegen
```

Run the dev server:
```bash
npm run dev
```

## Testing

Run unit and integration tests (Vitest + RTL):
```bash
npm test
```

Run end-to-end tests (Playwright):
Note: Requires the API to be running on `:4000`.
```bash
npm run test:e2e
```

Run type checking:
```bash
npm run typecheck
```

## CI/CD

A Github Actions workflow is configured in `.github/workflows/ci.yml`. It runs linting, typechecking, tests and builds the application on every push to `main` and on PRs.
