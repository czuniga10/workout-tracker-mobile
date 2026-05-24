import type { Workout } from "../../types";

export const conditioningA: Workout = {
  id: "hiit-plus",
  name: "HIIT +",
  focus: "High intensity conditioning + accessory lifting",
  notes: "Total session 45–55 min. No burnout on this day.",
  blocks: [
    {
      id: "block-1",
      type: "warmup",
      rounds: 1,
      restSeconds: 0,
      exercises: [
        { exerciseId: "kb-swing-light",        target: { type: "reps", value: 15 }, notes: "3 sets, easy pace, movement prep" },
        { exerciseId: "battle-rope-alt-waves", target: { type: "time", seconds: 20 }, notes: "3 rounds" },
        { exerciseId: "dynamic-mobility",      target: { type: "time", minSeconds: 120, maxSeconds: 180 } },
      ],
    },
    {
      id: "block-2",
      type: "conditioning_circuit",
      rounds: 5,
      restSeconds: 75,
      exercises: [
        { exerciseId: "kb-swing-heavy",    target: { type: "reps", value: 15 } },
        { exerciseId: "battle-rope-slams", target: { type: "time", seconds: 20 } },
        { exerciseId: "kb-goblet-squat",   target: { type: "reps", value: 12 } },
        { exerciseId: "kb-clean-press",    target: { type: "reps", value: 8, perSide: true } },
      ],
    },
    {
      id: "block-3",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      priority: "accessories",
      exercises: [
        { exerciseId: "cable-lateral-raise-low", target: { type: "reps", value: 15 } },
        { exerciseId: "lying-cable-curl",          target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-4",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      priority: "accessories",
      exercises: [
        { exerciseId: "cable-face-pull-high",       target: { type: "reps", value: 15 } },
        { exerciseId: "cable-kneeling-crunch-high", target: { type: "reps", value: 15 } },
      ],
    },
  ],
  // No burnout for conditioning days.
};
