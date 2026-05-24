import type { Workout } from "../../types";

export const chelseaFullBody: Workout = {
  id: "chelsea-full-body",
  name: "Full Body Conditioning",
  focus: "Full body — strength endurance",
  notes: "40 sec work / 20 sec rest. 4 rounds. Cool down: forward fold, hip stretch, child's pose, chest opener.",
  blocks: [
    {
      id: "block-1",
      type: "conditioning_circuit",
      rounds: 4,
      restSeconds: 20,
      exercises: [
        { exerciseId: "db-thruster",          target: { type: "time", seconds: 40 } },
        { exerciseId: "mountain-climber",     target: { type: "time", seconds: 40 } },
        { exerciseId: "renegade-row",         target: { type: "time", seconds: 40 } },
        { exerciseId: "skater-hop",           target: { type: "time", seconds: 40 } },
        { exerciseId: "db-deadlift-to-press", target: { type: "time", seconds: 40 } },
        { exerciseId: "plank-jack",           target: { type: "time", seconds: 40 } },
      ],
    },
  ],
};
