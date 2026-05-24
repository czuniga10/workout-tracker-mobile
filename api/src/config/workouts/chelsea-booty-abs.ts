import type { Workout } from "../../types";

export const chelseaBootyAbs: Workout = {
  id: "chelsea-booty-abs",
  name: "Booty + Abs",
  focus: "Glutes & core",
  notes: "3 rounds booty, 2–3 rounds abs. Minimal rest.",
  blocks: [
    {
      id: "block-1",
      type: "conditioning_circuit",
      rounds: 3,
      restSeconds: 30,
      exercises: [
        { exerciseId: "db-bulgarian-split-squat", target: { type: "reps", value: 10, perSide: true } },
        { exerciseId: "db-sumo-squat",            target: { type: "reps", value: 15 } },
        { exerciseId: "cable-glute-kickback-low", target: { type: "reps", value: 15, perSide: true } },
        { exerciseId: "curtsy-lunge",             target: { type: "reps", value: 12, perSide: true } },
        { exerciseId: "glute-bridge-pulse",       target: { type: "reps", value: 25 } },
      ],
    },
    {
      id: "block-2",
      type: "conditioning_circuit",
      rounds: 3,
      restSeconds: 20,
      priority: "core",
      exercises: [
        { exerciseId: "bicycle-crunch", target: { type: "reps", value: 20 } },
        { exerciseId: "heel-tap",       target: { type: "reps", value: 20 } },
        { exerciseId: "plank-hold",     target: { type: "time", seconds: 60 } },
        { exerciseId: "leg-raise",      target: { type: "reps", value: 12 } },
        { exerciseId: "flutter-kick",   target: { type: "time", seconds: 30 } },
      ],
    },
  ],
  burnout: {
    name: "Song Challenge",
    description: "Squat hold during the chorus. March or jog in place during the verse. Glute pulses during beat drops.",
  },
};
