import type { Workout } from "../../types";

export const chelseaUpperCore: Workout = {
  id: "chelsea-upper-core",
  name: "Upper Body + Core",
  focus: "Shoulders, chest, back, arms & core",
  notes: "3 rounds upper, 2 rounds core. Rest 30–45 sec between exercises.",
  blocks: [
    {
      id: "block-1",
      type: "warmup",
      rounds: 1,
      restSeconds: 0,
      exercises: [
        { exerciseId: "dynamic-mobility", target: { type: "time", minSeconds: 60, maxSeconds: 90 }, notes: "Arm circles, shoulder taps, cat/cow stretches, band pull-aparts" },
      ],
    },
    {
      id: "block-2",
      type: "conditioning_circuit",
      rounds: 3,
      restSeconds: 30,
      exercises: [
        { exerciseId: "db-seated-overhead-press",            target: { type: "reps", value: 12 } },
        { exerciseId: "db-bent-over-row",                    target: { type: "reps", value: 12 } },
        { exerciseId: "db-hammer-curl",                      target: { type: "reps", value: 15 } },
        { exerciseId: "db-chest-press",                      target: { type: "reps", value: 12 } },
        { exerciseId: "cable-overhead-tricep-extension-low", target: { type: "reps", value: 12 } },
      ],
    },
    {
      id: "block-3",
      type: "conditioning_circuit",
      rounds: 2,
      restSeconds: 30,
      priority: "core",
      exercises: [
        { exerciseId: "plank-hold",    target: { type: "time", seconds: 45 } },
        { exerciseId: "dead-bug",      target: { type: "reps", value: 12, perSide: true } },
        { exerciseId: "russian-twist", target: { type: "reps", value: 20 } },
        { exerciseId: "toe-touch",     target: { type: "reps", value: 15 } },
      ],
    },
  ],
};
