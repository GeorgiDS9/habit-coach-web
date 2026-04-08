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
3. (Optional) Run `npm run codegen` to sync with the latest backend schema.

## Authentication Flow

This application uses a dual-token JWT strategy (hardened in Sprint 4):
- **Access Token**: Short-lived (15m), stored in `localStorage`. Sent in the `Authorization: Bearer` header.
- **Refresh Token**: Long-lived (30d), stored in `localStorage`.
- **Automatic Refresh**: The `ApolloClientProvider` implements an `ErrorLink` interceptor. When a `401/UNAUTHENTICATED` error is received, the client automatically attempts to rotate tokens via the `refresh` mutation and retries the original request seamlessly.
- **Session Expiry**: If the refresh token is also invalid or expired, the user is redirected to `/login`.
- **Backend Revocation**: Logging out calls the `logout` mutation on the server to invalidate the session in the database.
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
