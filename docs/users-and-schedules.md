# Users & Schedules

Users and their weekly schedules are defined entirely in TypeScript config files. There is no user registration, login, or database-backed user management. The user list is hardcoded and selected from a dropdown in the app.

---

## User schema

Defined in `api/src/config/users.ts`:

```ts
interface User {
  id: string;        // Unique identifier. Used in the X-User-Id header on every API request.
  name: string;      // Display name shown in the UI
  initial: string;   // Single character shown in the avatar circle
  scheduleId: string; // Must match a key in the schedules map in users.ts
}
```

### Example

```ts
{ id: "chad", name: "Chad", initial: "C", scheduleId: "chad" }
```

---

## Schedule schema

Schedules are defined in `api/src/config/schedules/`. Each schedule is a TypeScript file that exports a `Schedule` object.

```ts
interface Schedule {
  id: string;    // Must match the key used in the schedules map in users.ts
  userId: string; // The user this schedule belongs to
  days: Record<DayOfWeek, ScheduleDay>;
}

type DayOfWeek =
  | "monday" | "tuesday" | "wednesday" | "thursday"
  | "friday" | "saturday" | "sunday";

interface ScheduleDay {
  workoutId: string | null; // null = rest day. Must match a key in workouts/index.ts
  label: string;            // Display label shown on calendar cells (e.g. "Upper 1", "Rest")
}
```

### Example — full schedule file

```ts
// api/src/config/schedules/chad.ts
import type { Schedule } from "../../types";

export const chadSchedule: Schedule = {
  id: "chad",
  userId: "chad",
  days: {
    monday:    { workoutId: "upper-1",   label: "Upper 1" },
    tuesday:   { workoutId: null,        label: "Rest" },
    wednesday: { workoutId: "lower",     label: "Lower" },
    thursday:  { workoutId: "upper-2",   label: "Upper 2" },
    friday:    { workoutId: "hiit-plus", label: "HIIT +" },
    saturday:  { workoutId: null,        label: "Rest" },
    sunday:    { workoutId: null,        label: "Rest" },
  },
};
```

---

## Adding a new user

### Step 1 — Create a schedule file

Create `api/src/config/schedules/newperson.ts`:

```ts
import type { Schedule } from "../../types";

export const newPersonSchedule: Schedule = {
  id: "newperson",
  userId: "newperson",
  days: {
    monday:    { workoutId: "upper-1",   label: "Upper 1" },
    tuesday:   { workoutId: null,        label: "Rest" },
    wednesday: { workoutId: "lower",     label: "Lower" },
    thursday:  { workoutId: "upper-2",   label: "Upper 2" },
    friday:    { workoutId: "hiit-plus", label: "HIIT +" },
    saturday:  { workoutId: null,        label: "Rest" },
    sunday:    { workoutId: null,        label: "Rest" },
  },
};
```

You can reuse existing workout IDs (sharing workouts with another user is fine) or create new workout files just for this user. See [workouts.md](./workouts.md).

### Step 2 — Register in users.ts

In `api/src/config/users.ts`:

```ts
import { newPersonSchedule } from "./schedules/newperson";

export const users: User[] = [
  { id: "chad",      name: "Chad",      initial: "C", scheduleId: "chad" },
  { id: "chelsea",   name: "Chelsea",   initial: "C", scheduleId: "chelsea" },
  { id: "newperson", name: "New Person", initial: "N", scheduleId: "newperson" },
];

export const schedules: Record<string, Schedule> = {
  chad:      chadSchedule,
  chelsea:   chelseaSchedule,
  newperson: newPersonSchedule,
};
```

### Step 3 — Rebuild

```bash
docker compose up -d --build api
```

The new user will appear in the user dropdown in the app immediately.

---

## How user identity works

The frontend stores the selected user ID in `localStorage` under the key `workoutTracker.userId`. Every API request includes an `X-User-Id` header with that value.

The API validates this header on every request (except `/api/users` and `/api/gifs`) in a `preHandler` hook in `server.ts`. If the header is missing or the ID doesn't match a known user, the request is rejected with a 400.

The validation logic is in `api/src/lib/userId.ts` — it checks the header value against the in-memory `users` array.

---

## Current users

| ID | Name | Schedule file | Workouts |
|----|------|--------------|---------|
| `chad` | Chad | `schedules/chad.ts` | Mon: Upper 1, Wed: Lower, Thu: Upper 2, Fri: HIIT+ |
| `chelsea` | Chelsea | `schedules/chelsea.ts` | Mon: Upper 1, Tue: Lower, Thu: Upper 2, Fri: HIIT+ |
