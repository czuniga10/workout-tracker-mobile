import type { Workout } from "../../types";

export const abCircuit: Workout = {
  id: "ab-circuit",
  name: "Ab Circuit",
  focus: "Core",
  notes: "3 rounds, minimal rest. Should take ~10 minutes total.",
  blocks: [
    {
      id: "block-1",
      type: "conditioning_circuit",
      rounds: 3,
      restSeconds: 30,
      exercises: [
        { exerciseId: "cable-kneeling-crunch-high", target: { type: "reps", min: 12, max: 15 }, notes: "Kneel facing away. Curl ribs toward hips." },
        { exerciseId: "ab-roller",                  target: { type: "reps", min: 8,  max: 12 }, notes: "Slow on the way out. Keep lower back flat." },
        { exerciseId: "hanging-knee-raise",          target: { type: "reps", min: 10, max: 15 }, notes: "No swinging. Tilt pelvis up at the top." },
        { exerciseId: "plank-hold",                  target: { type: "time", minSeconds: 30, maxSeconds: 45 } },
      ],
    },
  ],
};
