# meme-brain

Reddit Devvit app with React webview client and serverless Node.js backend.

## Project Structure

- `src/client/` - React webview (full-screen UI), uses `fetch(/api/...)` to call server
- `src/server/` - Serverless Node.js backend with Redis access
- `src/shared/` - Shared types and utilities between client/server

## Commands

```bash
npm run dev          # Start dev (client + server + devvit playtest)
npm run build        # Build client and server
npm run check        # Type-check + lint + format
npm run deploy       # Build and upload to Devvit
```

## Tech Stack

- TypeScript, React 19, Vite, Tailwind CSS 4
- Devvit SDK (@devvit/web)
- Redis for persistence (via `@devvit/web/server`)

## Code Guidelines

- Prefer type aliases over interfaces
- Assume tooling (vite, tailwind, eslint, prettier) works - bugs are likely in your code

### Client (`src/client/`)

- Use web-compatible NPM dependencies only
- Follow React hooks rules
- No websockets - use `devvit_search` for realtime info

### Server (`src/server/`)

- Serverless Node.js environment (like AWS Lambda)
- **Unavailable**: `fs`, `http`, `https`, `net`, websockets, HTTP streaming
- Use `fetch` instead of http/https
- Read-only filesystem - cannot write files
- Redis: `import { redis } from '@devvit/web/server'`
- No SQLite or stateful in-memory processes
