import type { Workout } from "../../types";

export const chelseaLower: Workout = {
  id: "chelsea-lower",
  name: "Lower",
  focus: "Glutes & quads",
  notes: "Rest 90s after hip thrusts, 60–75s between supersets. Controlled depth on all squat patterns — moderate load on split squats.",
  blocks: [
    {
      id: "block-1",
      type: "straight_set",
      rounds: 4,
      restSeconds: 90,
      exercises: [
        { exerciseId: "smith-hip-thrust", target: { type: "reps", value: 10 }, notes: "Full hip extension and squeeze at top. RPE 8." },
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
        { exerciseId: "db-bulgarian-split-squat",  target: { type: "reps", value: 10, perSide: true }, notes: "Moderate weight, controlled depth" },
        { exerciseId: "cable-glute-kickback-low",  target: { type: "reps", value: 15, perSide: true } },
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
    name: "Cable Kickback Drop Set into Glute Bridge Failure",
    description: "Cable kickback drop set: rep to failure, drop 10–15 lbs, rep to failure, one more drop, rep to failure — each side. Immediately drop to the floor: bodyweight glute bridges to absolute failure, full hip extension and hard glute squeeze at the top of every rep.",
  },
};
