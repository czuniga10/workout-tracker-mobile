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
        { exerciseId: "jump-rope",              target: { type: "time", seconds: 45 }, notes: "3 rounds, sub jumping jacks if no rope" },
        { exerciseId: "band-pull-apart",         target: { type: "reps", value: 15 }, notes: "3 rounds" },
        { exerciseId: "bw-squat-to-hip-opener", target: { type: "reps", value: 10, perSide: true }, notes: "2 rounds — squat down, open each knee out, stand" },
      ],
    },
    {
      id: "block-2",
      type: "conditioning_circuit",
      rounds: 5,
      restSeconds: 75,
      exercises: [
        { exerciseId: "battle-rope-alt-waves", target: { type: "time", seconds: 30 }, notes: "All out" },
        { exerciseId: "db-thruster",           target: { type: "reps", value: 12 }, notes: "25–35 lb DBs, squat to overhead press" },
        { exerciseId: "kb-swing-heavy",        target: { type: "reps", value: 15 }, notes: "35 lb, hip-hinge dominant" },
        { exerciseId: "burpee",                target: { type: "reps", value: 8 } },
      ],
    },
    {
      id: "block-3",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      priority: "accessories",
      exercises: [
        { exerciseId: "db-arnold-press",  target: { type: "reps", value: 12 } },
        { exerciseId: "lying-cable-curl", target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-4",
      type: "superset",
      rounds: 3,
      restSeconds: 60,
      priority: "accessories",
      exercises: [
        { exerciseId: "cable-straight-arm-pulldown-high", target: { type: "reps", value: 12 }, notes: "Stand facing stack, arms straight, pull down toward hips" },
        { exerciseId: "cable-kneeling-crunch-high",       target: { type: "reps", value: 15 } },
      ],
    },
  ],
  // No burnout for conditioning days.
};
