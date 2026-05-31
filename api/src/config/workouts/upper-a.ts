import type { Workout } from "../../types";

export const upperA: Workout = {
  id: "upper-2",
  name: "Upper 2",
  focus: "Chest & back",
  notes: "Rest 60–75s between supersets. Controlled eccentric on all pressing. RPE 7–8 on compounds.",
  blocks: [
    {
      id: "block-1",
      type: "superset",
      rounds: 4,
      restSeconds: 60,
      exercises: [
        { exerciseId: "db-bench-press",    target: { type: "reps", min: 8, max: 10 } },
        { exerciseId: "db-single-arm-row", target: { type: "reps", value: 10, perSide: true } },
      ],
    },
    {
      id: "block-2",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        { exerciseId: "db-incline-bench-press",         target: { type: "reps", value: 10 } },
        { exerciseId: "cable-straight-arm-pulldown-high", target: { type: "reps", value: 12 }, notes: "Stand facing stack, arms straight, pull down toward hips" },
      ],
    },
    {
      id: "block-3",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        { exerciseId: "cable-low-to-high-fly",                          target: { type: "reps", min: 12, max: 15 }, notes: "Upper chest emphasis" },
        { exerciseId: "cable-rear-delt-pull-single-arm-kneeling-high",  target: { type: "reps", value: 15, perSide: true }, notes: "Kneeling, high pulley, pull across body to ear height" },
      ],
    },
    {
      id: "block-4",
      type: "straight_set",
      rounds: 2,
      restSeconds: 60,
      exercises: [
        { exerciseId: "cable-tricep-pushdown", target: { type: "reps", value: 15 } },
      ],
    },
  ],
  burnout: {
    name: "Cable Fly Tri-Set",
    description: "No rest between stations: High Cable Fly 15 reps → Middle Cable Fly 15 reps → Low-to-High Cable Fly 15 reps. One continuous tri-set to failure.",
  },
};
