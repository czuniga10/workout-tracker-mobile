import type { Workout } from "../../types";

export const chelseaUpper1: Workout = {
  id: "chelsea-upper-1",
  name: "Upper 1",
  focus: "Shoulders — arms secondary",
  notes: "Rest 60s between supersets. RPE 7–8 on compounds. Mind-muscle connection on all curl and extension work.",
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
        { exerciseId: "db-incline-curl",                     target: { type: "reps", value: 12 }, notes: "Long head stretch — full extension at bottom" },
        { exerciseId: "cable-overhead-tricep-extension-low", target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-4",
      type: "superset",
      rounds: 4,
      restSeconds: 60,
      priority: "biceps",
      exercises: [
        { exerciseId: "db-hammer-curl",        target: { type: "reps", value: 12 } },
        { exerciseId: "cable-tricep-pushdown", target: { type: "reps", value: 12 } },
      ],
    },
  ],
  burnout: {
    name: "Cable Curl 21s into Pushdown Death Set",
    description: "Cable curl: 7 reps bottom→halfway, 7 halfway→top, 7 full range — no rest between thirds. Immediately switch to rope pushdown and rep to absolute failure, slow eccentric every rep.",
  },
};
