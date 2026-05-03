# Workout Tracker — Overview

A locally-hosted, mobile-first workout tracking SPA designed for home gym use. It runs on a home server and is accessed from phones over the local network. There is no cloud component — everything runs in Docker on your LAN.

---

## What it does

- Shows each user a weekly calendar with their scheduled workouts
- For each workout day, displays the full workout: blocks of exercises, sets, targets, and rest times
- Lets users log weight, reps, or duration per exercise per round
- Pre-fills inputs with data from the last time that same workout was completed
- Tracks session status: scheduled → in_progress → complete
- Lets users add session notes
- Shows a gif demonstration for exercises that have one (via WorkoutX API)
- Shows step-by-step instructions for exercises via an info button
- Supports multiple users, each with their own workout schedule

---

## Architecture

```
Browser (phone)
    │
    ▼
nginx (port 80 inside container, 8080 on host)
    ├── /           → serves the React SPA (static files)
    └── /api/*      → proxies to Fastify API (port 3000)
                          │
                          ├── config (in-memory)
                          │     users, schedules, workouts, exercises
                          │
                          └── PostgreSQL (port 5432, internal only)
                                WorkoutSession, ExerciseLog
```

Everything runs in three Docker containers defined in `docker-compose.yml`:

| Container | Image | Role |
|-----------|-------|------|
| `db` | postgres:16-alpine | Stores sessions and logs |
| `api` | node:20-alpine (built) | Fastify REST API + Prisma |
| `web` | nginx:1.27-alpine (built) | Serves React SPA, proxies `/api` |

---

## Key design decision: config is code

Users, schedules, workouts, and exercises are **not** stored in the database. They live in TypeScript files under `api/src/config/`. This means:

- Adding a new exercise = editing a `.ts` file and rebuilding
- No admin UI needed
- The database only stores what users actually log (sessions + exercise logs)
- Changing a workout definition retroactively affects how future sessions are hydrated

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, TanStack Query, Tailwind CSS |
| Backend | Fastify 4, TypeScript, Prisma 5 |
| Database | PostgreSQL 16 |
| Runtime | Node 20, nginx 1.27 |
| Containerization | Docker Compose |

---

## Directory structure

```
workout-tracker/
├── docker-compose.yml          # Orchestrates all three containers
├── .env                        # Secret values (gitignored)
├── .env.example                # Template for .env
│
├── api/                        # Fastify backend
│   ├── Dockerfile
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── src/
│       ├── server.ts           # Entry point, route registration
│       ├── prisma.ts           # Prisma client singleton
│       ├── types.ts            # Core TypeScript types
│       ├── config/
│       │   ├── exercises.ts    # All exercise definitions
│       │   ├── users.ts        # User list + schedule registry
│       │   ├── schedules/      # Per-user weekly schedules
│       │   └── workouts/       # Per-user/shared workout definitions
│       ├── routes/             # Fastify route handlers
│       └── lib/                # Shared utilities
│
└── web/                        # React frontend
    ├── Dockerfile
    ├── nginx.conf              # Serves SPA + proxies /api
    └── src/
        ├── App.tsx             # Router + auth gate
        ├── api/
        │   ├── client.ts       # fetch wrapper (injects X-User-Id header)
        │   └── types.ts        # API response types
        ├── components/         # UI components
        ├── hooks/              # TanStack Query hooks
        ├── lib/                # Utilities
        └── routes/             # Page-level route components
```
