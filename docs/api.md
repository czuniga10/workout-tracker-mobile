# API Reference

The Fastify API runs on port 3000 inside the container and is reverse-proxied from nginx at `/api/*`. All requests (except `/api/users` and `/api/gifs`) require an `X-User-Id` header with a valid user ID.

---

## Authentication

Every request requires:

```
X-User-Id: chad
```

The value must match a user `id` in `api/src/config/users.ts`. If missing or invalid, the server returns:

```json
{ "error": "missing X-User-Id" }
```

---

## Endpoints

### GET /api/users

Returns the list of all users. No auth header required.

**Response**
```json
[
  { "id": "chad", "name": "Chad", "initial": "C" },
  { "id": "chelsea", "name": "Chelsea", "initial": "C" }
]
```

---

### GET /api/schedule

Returns the weekly schedule for the authenticated user.

**Response**
```json
{
  "userId": "chad",
  "days": {
    "monday":    { "workoutId": "upper-1",   "label": "Upper 1" },
    "tuesday":   { "workoutId": null,        "label": "Rest" },
    "wednesday": { "workoutId": "lower",     "label": "Lower" },
    "thursday":  { "workoutId": "upper-2",   "label": "Upper 2" },
    "friday":    { "workoutId": "hiit-plus", "label": "HIIT +" },
    "saturday":  { "workoutId": null,        "label": "Rest" },
    "sunday":    { "workoutId": null,        "label": "Rest" }
  }
}
```

---

### GET /api/sessions/:date

Returns the full hydrated workout for a given date, or a rest indicator. Creates the session record in the database if it doesn't exist yet.

**Params**
- `date` — `yyyy-MM-dd` format (e.g. `2026-05-03`)

**Response — rest day**
```json
{
  "kind": "rest",
  "date": "2026-05-03"
}
```

**Response — workout day**
```json
{
  "kind": "workout",
  "session": {
    "id": "uuid",
    "userId": "chad",
    "date": "2026-05-03",
    "workoutId": "upper-1",
    "status": "scheduled",
    "notes": null,
    "createdAt": "2026-05-03T10:00:00.000Z",
    "updatedAt": "2026-05-03T10:00:00.000Z"
  },
  "workout": {
    "id": "upper-1",
    "name": "Upper 1",
    "focus": "Shoulders, arms — bicep priority",
    "notes": "Rest 60s between supersets...",
    "blocks": [
      {
        "id": "block-1",
        "type": "superset",
        "rounds": 4,
        "restSeconds": 60,
        "exercises": [
          {
            "exercise": {
              "id": "db-seated-overhead-press",
              "name": "DB Seated Overhead Press",
              "muscleGroup": "shoulders",
              "type": "weighted",
              "equipment": "Adjustable bench + dumbbells",
              "gifId": "0404",
              "instructions": ["..."],
              "description": "..."
            },
            "target": { "type": "reps", "min": 10, "max": 12 },
            "notes": null,
            "rounds": [
              {
                "roundNumber": 1,
                "logged": null,
                "prefill": { "weight": "35", "reps": 12, "durationSec": null }
              }
            ]
          }
        ]
      }
    ],
    "burnout": {
      "name": "Cable Curl 21s into DB Curl Death Set",
      "description": "..."
    }
  }
}
```

The `prefill` object on each round is populated from the most recent past session for the same workout. If no past data exists, all fields are `null`.

---

### PUT /api/sessions/:date/notes

Saves or updates the session notes for a given date. Creates the session if it doesn't exist.

**Params**
- `date` — `yyyy-MM-dd`

**Body**
```json
{ "notes": "Felt strong today. Increased bench by 5 lbs." }
```

**Response**
```json
{ "ok": true }
```

---

### POST /api/logs

Logs a single exercise round. Creates the session if it doesn't exist. Updates session status: `scheduled` → `in_progress` on first log, and → `complete` when all non-warmup rounds are filled.

**Body**
```json
{
  "date": "2026-05-03",
  "blockId": "block-1",
  "exerciseId": "db-seated-overhead-press",
  "roundNumber": 1,
  "weight": "40",
  "reps": 11,
  "durationSec": null
}
```

- `weight` — string or null (stored as `Decimal(6,2)`)
- `reps` — integer or null
- `durationSec` — integer or null
- At least one of weight/reps/durationSec must be provided for the log to count toward completion

This endpoint upserts — if a log already exists for the same `(sessionId, blockId, exerciseId, roundNumber)`, it is overwritten.

**Response**
```json
{
  "log": {
    "id": "uuid",
    "sessionId": "uuid",
    "blockId": "block-1",
    "exerciseId": "db-seated-overhead-press",
    "roundNumber": 1,
    "weight": "40",
    "reps": 11,
    "durationSec": null
  },
  "session": {
    "id": "uuid",
    "status": "in_progress"
  }
}
```

---

### GET /api/calendar?month=yyyy-MM

Returns all days in the given month with workout/rest status and session completion state.

**Query**
- `month` — `yyyy-MM` format (e.g. `2026-05`)

**Response**
```json
{
  "month": "2026-05",
  "days": [
    {
      "date": "2026-05-01",
      "kind": "rest"
    },
    {
      "date": "2026-05-04",
      "kind": "workout",
      "workoutId": "upper-1",
      "label": "Upper 1",
      "status": "complete"
    }
  ]
}
```

`status` values: `"scheduled"` (session exists but not started), `"in_progress"`, `"complete"`. If no session record exists yet, status defaults to `"scheduled"`.

---

### GET /api/gifs/:id

Proxies a gif from the WorkoutX API. No auth header required. Responses are cached by nginx/browser for 24 hours (`Cache-Control: public, max-age=86400`).

**Params**
- `id` — WorkoutX gif ID (4-digit zero-padded string, e.g. `0404`)

**Response** — `image/gif` binary, or `{ "error": "gif not found" }` if the upstream returns a non-200.

The WorkoutX API key is read from the `WORKOUTX_KEY` environment variable. Set it in `.env`.
