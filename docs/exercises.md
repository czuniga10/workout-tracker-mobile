# Exercises

All exercises are defined in `api/src/config/exercises.ts` as a single `Record<string, Exercise>` map. The key is the exercise ID (kebab-case string), which is referenced everywhere else in the codebase.

---

## Exercise schema

```ts
interface Exercise {
  id: string;           // Unique kebab-case identifier. Must match the map key.
  name: string;         // Display name shown in the UI
  muscleGroup: string;  // Primary muscle group (display only, not used for logic)
  type: ExerciseType;   // Controls which input fields are shown (see below)
  equipment: string;    // Equipment needed (display only)
  gifId: string | null; // WorkoutX gif ID for demo video. null = no gif button shown
  instructions?: string[]; // Step-by-step instructions. Shown via the (i) button
  description?: string;    // One-sentence description (optional, not currently rendered)
}

type ExerciseType = "weighted" | "bodyweight" | "timed";
```

### ExerciseType — what it controls

| Value | Weight input | Reps input | Duration input |
|-------|-------------|------------|----------------|
| `"weighted"` | ✅ shown | depends on target | depends on target |
| `"bodyweight"` | ❌ hidden | depends on target | depends on target |
| `"timed"` | ❌ hidden | ❌ hidden | ✅ shown |

The `type` field controls which input fields appear in `ExerciseRow.tsx`. For `weighted` and `bodyweight`, the rep/duration input is determined by the `target` on the block exercise (see [workouts.md](./workouts.md)).

---

## Adding a new exercise

1. Open `api/src/config/exercises.ts`
2. Add an entry to the `exercises` object
3. Use a unique kebab-case key
4. Rebuild the API container: `docker compose up -d --build api`

### Example

```ts
"db-lateral-raise": {
  id: "db-lateral-raise",
  name: "DB Lateral Raise",
  muscleGroup: "shoulders",
  type: "weighted",
  equipment: "Dumbbells",
  gifId: null,
  description: "Isolation movement for the lateral deltoid head.",
  instructions: [
    "Stand with feet shoulder-width apart, a dumbbell in each hand at your sides.",
    "With a slight bend in your elbows, raise both arms out to the sides until parallel to the floor.",
    "Pause briefly at the top.",
    "Lower under control back to your sides.",
    "Repeat for the desired number of repetitions.",
  ],
},
```

### gifId values

`gifId` is the WorkoutX numeric ID for the exercise gif. It is a 4-digit zero-padded string (e.g. `"0404"`). If you don't have a WorkoutX ID for the exercise, set it to `null` — the gif button will simply not appear.

To find a WorkoutX ID: use the `scripts/lookup-workoutx-ids.mjs` script (kept locally, not committed) or browse the WorkoutX API.

---

## Full exercise list

| ID | Name | Type | Muscle Group | gifId |
|----|------|------|-------------|-------|
| `db-seated-overhead-press` | DB Seated Overhead Press | weighted | shoulders | 0404 |
| `cable-lateral-raise-low` | Cable Lateral Raise (low pulley) | weighted | shoulders | 0178 |
| `smith-upright-row` | Smith Machine Upright Row | weighted | shoulders | 0120 |
| `cable-rear-delt-fly-high` | Cable Rear Delt Fly (high pulley) | weighted | rear delts | 0202 |
| `db-incline-curl` | DB Incline Curl | weighted | biceps | 0317 |
| `cable-overhead-tricep-extension-low` | Cable Overhead Tricep Extension (low pulley) | weighted | triceps | 0194 |
| `db-hammer-curl` | DB Hammer Curl | weighted | biceps | 0312 |
| `cable-tricep-pushdown` | Cable Tricep Pushdown | weighted | triceps | 0200 |
| `barbell-back-squat` | Barbell Back Squat | weighted | quads | null |
| `db-romanian-deadlift` | DB Romanian Deadlift | weighted | hamstrings | 1459 |
| `leg-extension` | Leg Extension | weighted | quads | 0585 |
| `db-bulgarian-split-squat` | DB Bulgarian Split Squat | weighted | quads | null |
| `cable-pull-through-low` | Cable Pull-Through (low pulley) | weighted | glutes | 0196 |
| `cable-kneeling-crunch-high` | Cable Kneeling Crunch (high pulley) | weighted | core | 0175 |
| `plank-hold` | Plank Hold | timed | core | 0464 |
| `barbell-bench-press` | Barbell Bench Press | weighted | chest | 0025 |
| `db-single-arm-row` | DB Single-Arm Row | weighted | back | 0293 |
| `db-incline-bench-press` | Incline DB Press | weighted | chest | 0314 |
| `cable-seated-row-low` | Cable Seated Row (low pulley) | weighted | back | 0861 |
| `cable-chest-fly-high` | Cable Chest Fly (high pulley) | weighted | chest | 0171 |
| `cable-face-pull-high` | Cable Face Pull (high pulley) | weighted | rear delts | null |
| `kb-swing-light` | KB Swings (light, warmup) | weighted | full body | 0549 |
| `kb-swing-heavy` | KB Swings (heavy) | weighted | full body | 0549 |
| `battle-rope-alt-waves` | Battle Rope Alternating Waves | timed | conditioning | 0128 |
| `battle-rope-slams` | Battle Rope Slams | timed | conditioning | null |
| `dynamic-mobility` | Dynamic Stretching / Mobility | timed | mobility | null |
| `kb-goblet-squat` | KB Goblet Squat | weighted | quads | 0534 |
| `kb-clean-press` | KB Single-Arm Clean & Press | weighted | full body | 0518 |
| `smith-hip-thrust` | Smith Machine Hip Thrust | weighted | glutes | null |
| `cable-glute-kickback-low` | Cable Glute Kickback (low pulley) | weighted | glutes | null |
