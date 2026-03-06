# CLAUDE.md - Enterprise Account Research Agent

## Project Overview

AI-powered enterprise account research and B2B sales platform ("AccountAI") that uses Claude AI and LinkedIn Sales Navigator integration to automate account research, outreach message generation, meeting transcription, and strategic account planning.

## Tech Stack

- **Backend**: Node.js + Express (TypeScript), PostgreSQL (`pg`), Anthropic Claude API
- **Frontend**: React 18 + Vite 5 (TypeScript)
- **Validation**: Zod
- **Testing**: Vitest (no test files exist yet)
- **Package type**: ESM (`"type": "module"`)

## Quick Reference Commands

```bash
npm run dev          # Start both API (port 3001) and web (port 5173) dev servers
npm run dev:api      # API only with hot-reload (tsx watch)
npm run dev:web      # Vite dev server only
npm run build        # Build API (tsc) then web (vite build)
npm run start        # Run production API from dist/
npm run test         # Run vitest
npm run lint         # ESLint on src/
npm run type-check   # tsc --noEmit
```

## Project Structure

```
src/
├── api/                          # Express backend
│   ├── server.ts                 # Express app setup, middleware, routes, health check
│   ├── routes/
│   │   ├── accounts.ts           # Account CRUD (GET/POST /accounts)
│   │   ├── .../research.ts       # POST /research/analyze (Claude-powered)
│   │   ├── .../prospecting.ts    # POST /prospecting/generate-message
│   │   ├── .../meetings.ts       # POST /meetings/transcribe
│   │   └── .../linkedin.ts       # POST /linkedin/sync, /fetch-accounts, /fetch-contacts
│   ├── services/
│   │   ├── claudeService.ts      # Claude API wrapper (analyze, outreach, transcribe, plan)
│   │   └── linkedinService.ts    # LinkedIn Navigator API client
│   └── middleware/
│       └── errorHandler.ts       # Global Express error handler
├── web/                          # React frontend
│   ├── main.tsx                  # React DOM entry point
│   ├── App.tsx                   # Router switching between pages
│   ├── index.css                 # Global styles (sidebar layout, cards, grid)
│   ├── components/
│   │   └── Navigation.tsx        # Sidebar navigation
│   └── pages/
│       ├── Dashboard.tsx         # Stats overview
│       ├── AccountResearch.tsx   # Claude-powered account analysis
│       ├── EnterprisePlanning.tsx # 90-day strategy generation
│       ├── Prospecting.tsx       # Outreach message generation
│       ├── LinkedInSync.tsx      # LinkedIn Navigator sync
│       └── MeetingNotes.t        # Meeting recording/transcription
└── shared/
    ├── types.ts                  # Core TypeScript interfaces (Account, Contact, etc.)
    └── services/                 # Shared service implementations
```

**Note**: Some route files have deeply nested paths due to a repository structure issue (e.g., `src/api/routes/src/api/routes/.../research.ts`). The `MeetingNotes` page file has extension `.t` instead of `.tsx`.

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key (required for AI features) |
| `LINKEDIN_CLIENT_ID` / `CLIENT_SECRET` | LinkedIn Sales Navigator OAuth |
| `LINKEDIN_REDIRECT_URI` | OAuth callback (`http://localhost:5173/auth/linkedin/callback`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `DEEPGRAM_API_KEY` | Voice transcription service |
| `JWT_SECRET` | JWT authentication secret |
| `PORT` | API server port (default: 3001) |
| `API_URL` / `WEB_URL` | Service URLs for cross-origin |

## TypeScript Configuration

- **Target**: ES2020, **Module**: ESNext, **Strict mode**: enabled
- `noUnusedLocals` and `noUnusedParameters` are enforced
- Path aliases: `@/*` -> `src/*`, `@api/*` -> `src/api/*`, `@web/*` -> `src/web/*`, `@shared/*` -> `src/shared/*`

## Key Conventions

- **Shared types** live in `src/shared/types.ts` — always import from there
- **Claude AI integration** is centralized in `claudeService.ts` with methods: `analyzeAccount()`, `generateOutreachMessage()`, `processMeetingTranscript()`, `createAccountPlan()`
- **API routes** use `express-async-errors` for automatic async error handling
- **Frontend** uses simple client-side routing in `App.tsx` (no router library)
- **Styling** is CSS-based with a fixed 280px sidebar layout and card-based components

## Known Issues

- Route files have incorrect nested directory structure (paths contain repeated `src/api/routes/` segments)
- `MeetingNotes.t` should be `MeetingNotes.tsx`
- No test files exist yet despite Vitest being configured
- No ESLint or Prettier config files present (using defaults)
- No Vite config file (using defaults)
