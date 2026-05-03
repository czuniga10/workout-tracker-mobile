# Workouts

A workout is a named collection of blocks. Each block is a group of exercises with a type, round count, rest time, and list of exercises with targets. Workouts live in `api/src/config/workouts/` as individual TypeScript files and are registered in `api/src/config/workouts/index.ts`.

---

## Workout schema

```ts
interface Workout {
  id: string;       // Unique ID. Must match the key in workouts/index.ts
  name: string;     // Display name (e.g. "Upper 1")
  focus: string;    // Short phrase shown under the name (e.g. "Shoulders & arms")
  notes: string;    // Shown as a callout at the top of the workout day. Use for
                    // rest time guidance, RPE cues, or technique reminders.
  blocks: Block[];  // Ordered list of blocks
  burnout?: Burnout; // Optional finisher. Omit for HIIT/conditioning days.
}
```

---

## Block schema

```ts
interface Block {
  id: string;           // Unique within the workout (e.g. "block-1", "block-2")
  type: BlockType;      // Controls how the block is rendered (see below)
  rounds: number;       // How many times the block is repeated
  restSeconds: number;  // Rest between rounds (shown to the user)
  priority?: string;    // Optional label (e.g. "biceps", "core", "accessories")
                        // Shown as a sub-label in the block header
  exercises: BlockExercise[];
}

type BlockType =
  | "superset"             // 2+ exercises alternated per round
  | "straight_set"         // 1 exercise, multiple rounds
  | "conditioning_circuit" // 3-4 exercises back-to-back per round, no logging
  | "warmup"               // Light prep block, always 1 round, not counted in progress
```

### BlockType details

**`superset`** — Two exercises done back-to-back, then rest. Renders in `BlockSuperset.tsx`. Logging inputs shown for each exercise in each round.

**`straight_set`** — One exercise, done for N rounds with rest between. Also renders in `BlockSuperset.tsx` (same component handles both). Logging inputs shown.

**`conditioning_circuit`** — Multiple exercises done circuit-style. Renders in `BlockConditioning.tsx`. No logging inputs — gif buttons only. Used for HIIT days.

**`warmup`** — Exactly like `conditioning_circuit` visually but renders in `BlockWarmup.tsx` with a "WARMUP" badge. Not counted in round progress calculation.

---

## BlockExercise schema

```ts
interface BlockExercise {
  exerciseId: string;   // Must match a key in exercises.ts
  target: ExerciseTarget; // The rep/time goal shown to the user
  notes?: string;       // Optional per-exercise note shown under the target
                        // (e.g. "Long head focus", "RPE 8")
}
```

### ExerciseTarget — all variants

```ts
// Fixed rep count
{ type: "reps"; value: number }
// e.g. { type: "reps", value: 12 }  →  shows "Target 12 reps"

// Rep range
{ type: "reps"; min: number; max: number }
// e.g. { type: "reps", min: 8, max: 10 }  →  shows "Target 8–10 reps"

// Per-side reps (unilateral exercises)
{ type: "reps"; value: number; perSide: true }
// e.g. { type: "reps", value: 10, perSide: true }  →  shows "Target 10 reps (each side)"

// Fixed duration
{ type: "time"; seconds: number }
// e.g. { type: "time", seconds: 20 }  →  shows "Target 20s"

// Duration range
{ type: "time"; minSeconds: number; maxSeconds: number }
// e.g. { type: "time", minSeconds: 45, maxSeconds: 60 }  →  shows "Target 45–60s"
```

---

## Burnout schema

```ts
interface Burnout {
  name: string;        // Short title (e.g. "Cable Fly Drop Set into Push-Ups")
  description: string; // Full instructions in plain English. 1-3 sentences.
                       // Describe the exact sequence, weights, failure criteria.
}
```

Burnouts are rendered by `BlockBurnout.tsx` at the bottom of the workout. They have no logging inputs — they are descriptive only. Omit the `burnout` key entirely on conditioning/HIIT days.

---

## Creating a new workout

### Step 1 — Create the file

Create `api/src/config/workouts/my-workout.ts`:

```ts
import type { Workout } from "../../types";

export const myWorkout: Workout = {
  id: "my-workout",
  name: "Pull Day",
  focus: "Back & biceps",
  notes: "Rest 60–75s between supersets. RPE 7–8 on compounds.",
  blocks: [
    {
      id: "block-1",
      type: "superset",
      rounds: 4,
      restSeconds: 60,
      exercises: [
        {
          exerciseId: "db-single-arm-row",
          target: { type: "reps", value: 10, perSide: true },
        },
        {
          exerciseId: "db-incline-curl",
          target: { type: "reps", value: 12 },
          notes: "Slow eccentric",
        },
      ],
    },
    {
      id: "block-2",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        {
          exerciseId: "cable-seated-row-low",
          target: { type: "reps", value: 12 },
        },
        {
          exerciseId: "cable-rear-delt-fly-high",
          target: { type: "reps", value: 15 },
        },
      ],
    },
    {
      id: "block-3",
      type: "straight_set",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        {
          exerciseId: "cable-face-pull-high",
          target: { type: "reps", value: 15 },
        },
      ],
    },
  ],
  burnout: {
    name: "Cable Curl Death Set",
    description:
      "Start at a moderate weight and curl to failure. Drop 10 lbs, rep to failure. One more drop, rep to failure. Slow eccentric on every rep throughout.",
  },
};
```

### Step 2 — Register it

In `api/src/config/workouts/index.ts`, import and add to the map:

```ts
import { myWorkout } from "./my-workout";

export const workouts: Record<string, Workout> = {
  // ...existing entries...
  "my-workout": myWorkout,
};
```

### Step 3 — Assign it to a schedule day

See [users.md](./users.md) for how to attach workout IDs to schedule days.

### Step 4 — Rebuild

```bash
docker compose up -d --build api
```

---

## Block ID rules

Block IDs must be unique within a workout. They are stored directly in the `ExerciseLog` table, so **do not change a block ID on an existing workout** — doing so will break prefill for any users who have past logs for that workout. If you need to restructure a workout, create a new workout with a new ID instead.

---

## Current workouts

### Chad's workouts

| ID | File | Name | Focus |
|----|------|------|-------|
| `upper-1` | `upper-b.ts` | Upper 1 | Shoulders, arms — bicep priority |
| `upper-2` | `upper-a.ts` | Upper 2 | Chest & back |
| `lower` | `lower-a.ts` | Lower | Quads, glutes & core |
| `hiit-plus` | `conditioning-a.ts` | HIIT + | High intensity conditioning + accessory lifting |

### Chelsea's workouts

| ID | File | Name | Focus |
|----|------|------|-------|
| `chelsea-upper-1` | `chelsea-upper-1.ts` | Upper 1 | Shoulders — arms secondary |
| `chelsea-upper-2` | `chelsea-upper-2.ts` | Upper 2 | Chest & back |
| `chelsea-lower` | `chelsea-lower.ts` | Lower | Glutes & quads |
| `chelsea-hiit-plus` | `chelsea-conditioning.ts` | HIIT + | High intensity conditioning + accessory lifting |

> Note: The file naming convention for Chad's workouts uses a letter suffix (`upper-a`, `upper-b`, `lower-a`, `conditioning-a`). Chelsea's use a name prefix. Either convention works — what matters is that the `id` field inside the file matches the key in `index.ts`.
