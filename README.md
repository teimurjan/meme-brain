# MemeBrain

A Reddit game where you pick the funniest wrong take on a meme.

## How it works

1. See a meme from popular subreddits
2. AI generates three hilariously wrong interpretations
3. Pick the one that speaks to your soul
4. Get roasted based on your choice
5. Build your humor profile over time
6. Share your results to the comments

## Features

### The 1-42-69 Club

Be the 1st, 42nd, or 69th player of the day to claim a legendary spot:

- **#1 The Pioneer** — First to play
- **#42 The Answer** — The Answer to Life, the Universe, and Everything
- **#69 Nice** — You know exactly why

Club resets daily at midnight UTC.

### Humor Profile

A radar chart tracks your humor tendencies across 5 dimensions based on your choices:

- **Absurdist** — Embraces chaos and nonsense
- **Wholesome** — Finds the good in everything
- **Edgy** — Lives on the edge of acceptable
- **Normie** — Plays it safe
- **Unhinged** — Beyond conventional humor

### Streaks

Play daily to build your streak. History is kept for the last 7 days.

## Content generation

AI generates three distinct flavors of "confidently wrong" takes on each meme:

- References specific visual elements from the image
- Channels peak Reddit energy (self-deprecating, absurdist, terminally online)
- Each option has a unique humor profile and personality roast

Content is generated per-post using GPT-4 with the meme image as context.

## Stack

- React 19 + Vite + Tailwind CSS 4
- Express 5 serverless backend
- Redis for persistence (with TTL-based cleanup)
- OpenAI GPT for content generation (multimodal)
- Reddit Devvit platform

## Development

```bash
npm install
npm run dev
```

This starts a local dev server with hot reload. You'll need:

- Node 22+
- A Reddit account connected to [developers.reddit.com](https://developers.reddit.com)
- OpenAI API key in your Devvit app settings

Set `VITE_STAGE=development` in `src/client/.env` to enable debug features like the database reset button.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run check    # Type-check + lint + format
npm run deploy   # Upload to Devvit
```

## Project structure

```
src/
├── client/          # React webview
│   ├── components/  # UI components
│   ├── hooks/       # Game state logic
│   └── game/        # Main app entry
├── server/          # Express backend
│   ├── api/         # HTTP endpoints
│   ├── core/        # Game logic, LLM client
│   └── storage/     # Redis operations
└── shared/          # Types shared between client/server
```

## Redis storage

| Key pattern           | Data                       | TTL    |
| --------------------- | -------------------------- | ------ |
| `challenge:{postId}`  | Challenge JSON             | 48hr   |
| `user:{userId}:state` | User state + 7-day history | None   |
| `plays:{YYYY-MM-DD}`  | Daily play count           | 7 days |
| `club:{YYYY-MM-DD}`   | Daily club members         | 7 days |

## Configuration

Environment variables (set in Devvit app settings):

- `VITE_OPENAI_API_KEY` — OpenAI API key for content generation

Meme sources are configured in `src/server/config.ts`.

## License

MIT
