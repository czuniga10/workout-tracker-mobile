import type { Workout } from "../../types";

export const chelseaLowerBody: Workout = {
  id: "chelsea-lower-body",
  name: "Lower Body Strength + Glutes",
  focus: "Glutes, quads & hamstrings",
  notes: "3 rounds main circuit, minimal rest. Finisher: 3 rounds x 30 sec each.",
  blocks: [
    {
      id: "block-1",
      type: "warmup",
      rounds: 1,
      restSeconds: 0,
      exercises: [
        { exerciseId: "glute-bridge",     target: { type: "reps", value: 15 }, notes: "Easy pace, movement prep" },
        { exerciseId: "reverse-lunge",    target: { type: "reps", value: 10, perSide: true }, notes: "Bodyweight only" },
        { exerciseId: "dynamic-mobility", target: { type: "time", minSeconds: 60, maxSeconds: 90 }, notes: "Bodyweight squats x15, arm swings, hip circles" },
      ],
    },
    {
      id: "block-2",
      type: "conditioning_circuit",
      rounds: 3,
      restSeconds: 30,
      exercises: [
        { exerciseId: "kb-goblet-squat",      target: { type: "reps", value: 12 } },
        { exerciseId: "db-romanian-deadlift", target: { type: "reps", value: 12 } },
        { exerciseId: "reverse-lunge",        target: { type: "reps", value: 10, perSide: true } },
        { exerciseId: "glute-bridge",         target: { type: "reps", value: 20 } },
        { exerciseId: "wall-sit",             target: { type: "time", seconds: 45 } },
      ],
    },
    {
      id: "block-3",
      type: "conditioning_circuit",
      rounds: 3,
      restSeconds: 20,
      exercises: [
        { exerciseId: "squat-pulse", target: { type: "time", seconds: 30 } },
        { exerciseId: "jump-squat",  target: { type: "time", seconds: 30 }, notes: "Modify to regular squat if needed" },
        { exerciseId: "high-knee",   target: { type: "time", seconds: 30 } },
      ],
    },
  ],
};
