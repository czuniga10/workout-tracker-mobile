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
        { exerciseId: "barbell-bench-press", target: { type: "reps", min: 8, max: 10 } },
        { exerciseId: "db-single-arm-row",   target: { type: "reps", value: 10, perSide: true } },
      ],
    },
    {
      id: "block-2",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        { exerciseId: "db-incline-bench-press", target: { type: "reps", value: 10 } },
        { exerciseId: "cable-seated-row-low",   target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-3",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      exercises: [
        { exerciseId: "cable-chest-fly-high", target: { type: "reps", min: 12, max: 15 } },
        { exerciseId: "cable-face-pull-high", target: { type: "reps", value: 15 } },
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
    name: "Cable Fly Drop Set into Push-Ups",
    description: "Set cables to chest height. Rep to failure (~15–20 reps), drop weight 20–25 lbs, rep to failure, one more drop, rep to failure. Immediately drop to the floor and do push-ups to absolute failure.",
  },
};
