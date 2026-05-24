import type { Workout } from "../../types";

export const chelseaPilates: Workout = {
  id: "chelsea-pilates",
  name: "Pilates + Low Impact Sculpt",
  focus: "Core, glutes & mobility",
  notes: "3 rounds, slow and controlled. Focus on mind-muscle connection throughout.",
  blocks: [
    {
      id: "block-1",
      type: "conditioning_circuit",
      rounds: 3,
      restSeconds: 20,
      exercises: [
        { exerciseId: "glute-bridge-march",  target: { type: "reps", value: 20 } },
        { exerciseId: "bird-dog",            target: { type: "reps", value: 12, perSide: true } },
        { exerciseId: "side-lying-leg-lift", target: { type: "reps", value: 15, perSide: true } },
        { exerciseId: "pilates-roll-up",     target: { type: "reps", value: 10 } },
        { exerciseId: "fire-hydrant",        target: { type: "reps", value: 15, perSide: true } },
        { exerciseId: "glute-bridge",        target: { type: "reps", value: 15 }, notes: "Slow — 3 sec down" },
        { exerciseId: "plank-shoulder-tap",  target: { type: "reps", value: 20 } },
      ],
    },
  ],
  burnout: {
    name: "Optional Finisher",
    description: "Wall sit — 1 minute. Glute bridge hold — 1 minute. Plank — 1 minute. Rest only as needed between holds.",
  },
};
