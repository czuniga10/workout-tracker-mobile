import type { Workout } from "../../types";

export const lowerA: Workout = {
  id: "lower",
  name: "Lower",
  focus: "Hamstrings, glutes & core",
  notes: "Rest 75–90s between supersets — legs need more recovery. Controlled eccentric on all movements.",
  blocks: [
    {
      id: "block-1",
      type: "straight_set",
      rounds: 4,
      restSeconds: 90,
      exercises: [
        { exerciseId: "barbell-romanian-deadlift", target: { type: "reps", value: 8 }, notes: "Primary compound. RPE 8. Posterior chain dominant." },
      ],
    },
    {
      id: "block-2",
      type: "superset",
      rounds: 3,
      restSeconds: 75,
      exercises: [
        { exerciseId: "leg-curl",      target: { type: "reps", value: 12 } },
        { exerciseId: "leg-extension", target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-3",
      type: "superset",
      rounds: 3,
      restSeconds: 75,
      exercises: [
        { exerciseId: "db-reverse-lunge", target: { type: "reps", value: 10, perSide: true }, notes: "Glute emphasis on step back" },
        { exerciseId: "db-hip-thrust",    target: { type: "reps", value: 15 }, notes: "Full glute squeeze at top, controlled lower" },
      ],
    },
    {
      id: "block-4",
      type: "superset",
      rounds: 3,
      restSeconds: 45,
      priority: "core",
      exercises: [
        { exerciseId: "ab-roller", target: { type: "reps", min: 8, max: 12 }, notes: "Slow on the way out, keep lower back flat" },
        { exerciseId: "dead-bug",  target: { type: "reps", value: 10, perSide: true }, notes: "Anti-extension core, controlled breathing" },
      ],
    },
  ],
  burnout: {
    name: "Leg Curl + Leg Extension Drop Set",
    description: "Leg curl to failure → drop weight → failure again. No rest — immediately move to leg extension, same format: failure → drop → failure. One continuous burnout.",
  },
};
