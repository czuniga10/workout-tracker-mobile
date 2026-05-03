# Documentation

This directory contains full documentation for the workout tracker codebase.

| File | What it covers |
|------|---------------|
| [overview.md](./overview.md) | What the app does, architecture, tech stack, directory structure |
| [exercises.md](./exercises.md) | Exercise schema, how to add new exercises, full exercise list |
| [workouts.md](./workouts.md) | Workout and block schemas, all target types, how to create new workouts |
| [users-and-schedules.md](./users-and-schedules.md) | User schema, schedule schema, how to add new users |
| [api.md](./api.md) | All API endpoints with request/response examples |
| [database.md](./database.md) | Prisma schema, how sessions/logs work, prefill logic, migrations |
| [frontend.md](./frontend.md) | Component tree, data flow, hooks, routing, styles |
| [deployment.md](./deployment.md) | Setup on a new machine, environment variables, updates, backups |

## Quick reference — adding things

**New exercise** → edit `api/src/config/exercises.ts`, rebuild api  
**New workout** → add file in `api/src/config/workouts/`, register in `workouts/index.ts`, rebuild api  
**New user** → add schedule file in `api/src/config/schedules/`, register in `api/src/config/users.ts`, rebuild api  
**Change a user's schedule** → edit their schedule file in `api/src/config/schedules/`, rebuild api
