# Database

PostgreSQL 16 via Prisma 5. The schema is defined in `api/prisma/schema.prisma`. The database only stores runtime data — sessions and exercise logs. All workout definitions, users, and schedules are in TypeScript config files and never hit the database.

---

## Models

### WorkoutSession

Represents one user's instance of a workout on a specific date.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key, auto-generated |
| `userId` | String | Matches a user `id` in config. Not a foreign key — users live in code. |
| `workoutId` | String | Matches a workout `id` in config. Stored for reference/querying. |
| `date` | Date | The calendar date of the workout. No time component. |
| `status` | Enum | `scheduled` → `in_progress` → `complete` |
| `notes` | Text? | Optional free-text notes added by the user |
| `createdAt` | DateTime | Auto-set on create |
| `updatedAt` | DateTime | Auto-updated on every write |

**Constraints**
- `(userId, date)` is unique — one session per user per day
- Indexed on `(userId, workoutId)` for prefill queries
- Indexed on `(userId, status)` for future filtering

**Status transitions**
- Created as `scheduled` when a session is first hydrated (page load)
- Transitions to `in_progress` on the first `POST /api/logs`
- Transitions to `complete` when every non-warmup exercise round has a log with at least one non-null value

---

### ExerciseLog

Represents one logged set — a single exercise in a single round of a single session.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key, auto-generated |
| `sessionId` | UUID | Foreign key → WorkoutSession. Cascades on delete. |
| `blockId` | String | The `id` field of the Block (e.g. `"block-1"`). Stored as a string — not normalized. |
| `exerciseId` | String | The exercise `id` (e.g. `"db-seated-overhead-press"`). Not a foreign key. |
| `roundNumber` | Int | 1-indexed round number within the block |
| `weight` | Decimal(6,2)? | Weight in lbs. Null for bodyweight/timed exercises. |
| `reps` | Int? | Rep count. Null for timed exercises. |
| `durationSec` | Int? | Duration in seconds. Null for rep-based exercises. |
| `createdAt` | DateTime | Auto-set on create |
| `updatedAt` | DateTime | Auto-updated on every write |

**Constraints**
- `(sessionId, blockId, exerciseId, roundNumber)` is unique — only one log per exercise per round per session. `POST /api/logs` uses an upsert against this constraint.
- Indexed on `sessionId`

---

## How prefill works

When a workout day is loaded, the API queries all past `ExerciseLog` rows for the same user + workoutId where `date < today`, ordered by session date descending. For each `(blockId, exerciseId, roundNumber)` slot in the current workout, it scans through past logs most-recent-first and picks the first non-null value for each field independently.

This means:
- If you logged `40 lbs × 10 reps` last week and `45 lbs × null` the week before, prefill will show `45 lbs` for weight (most recent) and `10` for reps (most recent non-null)
- Prefill is per-round: round 1 and round 2 can have different prefill values if you logged different weights in past sessions

The logic lives in `api/src/lib/prefill.ts`.

---

## Migrations

The app uses `prisma db push` (not migrations) on startup:

```dockerfile
CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]
```

This means schema changes are applied automatically on container start. There is no migration history tracked in the database. This is appropriate for a small local app but means you cannot roll back schema changes automatically.

If you change the schema:
1. Edit `api/prisma/schema.prisma`
2. Rebuild: `docker compose up -d --build api`
3. `prisma db push` runs on startup and applies the changes

**Warning:** Dropping columns or tables via schema changes will delete data permanently. `prisma db push` will warn you and ask for confirmation interactively — but since it runs non-interactively in Docker, it uses `--accept-data-loss` implicitly. Be careful with destructive schema changes.

---

## Connecting directly to the database

The database port is not exposed to the host in `docker-compose.yml`. To connect directly:

```bash
docker exec -it workout-tracker-db-1 psql -U postgres -d workout_tracker
```

Or expose port 5432 temporarily by adding to `docker-compose.yml`:
```yaml
ports:
  - "5432:5432"
```
