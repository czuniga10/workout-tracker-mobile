import type { Workout } from "../../types";

export const lowerA: Workout = {
  id: "lower",
  name: "Lower",
  focus: "Quads, glutes & core",
  notes: "Rest 75–90s between supersets — legs need more recovery. ATG or just below parallel on squats.",
  blocks: [
    {
      id: "block-1",
      type: "straight_set",
      rounds: 4,
      restSeconds: 90,
      exercises: [
        { exerciseId: "barbell-back-squat", target: { type: "reps", value: 8 }, notes: "Primary compound. RPE 8." },
      ],
    },
    {
      id: "block-2",
      type: "superset",
      rounds: 3,
      restSeconds: 75,
      exercises: [
        { exerciseId: "db-romanian-deadlift", target: { type: "reps", value: 10 } },
        { exerciseId: "leg-extension",        target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-3",
      type: "superset",
      rounds: 3,
      restSeconds: 75,
      exercises: [
        { exerciseId: "db-bulgarian-split-squat", target: { type: "reps", value: 10, perSide: true } },
        { exerciseId: "cable-pull-through-low",   target: { type: "reps", value: 15 } },
      ],
    },
    {
      id: "block-4",
      type: "superset",
      rounds: 3,
      restSeconds: 45,
      priority: "core",
      exercises: [
        { exerciseId: "cable-kneeling-crunch-high", target: { type: "reps", value: 15 } },
        { exerciseId: "plank-hold",                 target: { type: "time", minSeconds: 45, maxSeconds: 60 } },
      ],
    },
  ],
  burnout: {
    name: "Wall Sit into Bodyweight Squat Pulse",
    description: "Hold a deep wall sit to failure, immediately drop into bodyweight squats pulsing at the bottom — no lockout, stay in the burn zone. Go until you physically cannot continue.",
  },
};
