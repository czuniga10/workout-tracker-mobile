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
      rounds: 4,
      restSeconds: 60,
      exercises: [
        { exerciseId: "db-seated-overhead-press", target: { type: "reps", min: 10, max: 12 } },
        { exerciseId: "cable-lateral-raise-low",  target: { type: "reps", value: 15 } },
      ],
    },
    {
      id: "block-2",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        { exerciseId: "smith-upright-row",        target: { type: "reps", value: 12 } },
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
        { exerciseId: "db-incline-curl",                       target: { type: "reps", value: 12 }, notes: "Long head focus" },
        { exerciseId: "cable-overhead-tricep-extension-low",   target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-4",
      type: "superset",
      rounds: 4,
      restSeconds: 60,
      priority: "biceps",
      exercises: [
        { exerciseId: "db-hammer-curl",        target: { type: "reps", value: 12 }, notes: "Brachialis / brachioradialis" },
        { exerciseId: "cable-tricep-pushdown", target: { type: "reps", value: 12 } },
      ],
    },
  ],
  burnout: {
    name: "Cable Curl 21s into DB Curl Death Set",
    description: "Cable curl: 7 reps bottom→halfway, 7 halfway→top, 7 full range — no rest. Immediately grab the lightest DBs available and curl to absolute failure, slow eccentric on every rep.",
  },
};
