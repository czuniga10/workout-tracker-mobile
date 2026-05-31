import type { Workout } from "../../types";

export const upperB: Workout = {
  id: "upper-1",
  name: "Upper 1",
  focus: "Shoulders, arms — bicep priority",
  notes: "Rest 60s between supersets. RPE 7–8 on compounds. Mind-muscle connection on isolation work.",
  blocks: [
    {
      id: "block-1",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        { exerciseId: "smith-machine-shoulder-press", target: { type: "reps", min: 10, max: 12 } },
        { exerciseId: "db-lateral-raise",             target: { type: "reps", value: 15 } },
      ],
    },
    {
      id: "block-2",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        { exerciseId: "db-arnold-press",          target: { type: "reps", value: 12 } },
        { exerciseId: "cable-rear-delt-fly-high", target: { type: "reps", value: 15 } },
      ],
    },
    {
      id: "block-3",
      type: "superset",
      rounds: 4,
      restSeconds: 60,
      priority: "biceps",
      exercises: [
        { exerciseId: "cable-drag-curl",                     target: { type: "reps", value: 12 }, notes: "Long head focus — elbows pinned back throughout" },
        { exerciseId: "cable-overhead-tricep-extension-low", target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-4",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      priority: "biceps",
      exercises: [
        { exerciseId: "db-concentration-curl-single-arm",        target: { type: "reps", value: 12, perSide: true }, notes: "Elbow braced on inner thigh, full supination at top" },
        { exerciseId: "db-overhead-tricep-extension-single-arm", target: { type: "reps", value: 12, perSide: true } },
      ],
    },
  ],
  burnout: {
    name: "DB Bicep Medley + Rack Stretch",
    description: "3 rounds, no rest between exercises: 12 DB Curls → 12 Hammer Curls → 12 Cross-Body Hammer Curls → 12 Reverse Curls → 30 sec Rack Bicep Stretch. Rest only between rounds if needed.",
  },
};
