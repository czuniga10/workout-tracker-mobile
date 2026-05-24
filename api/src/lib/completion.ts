import type { Workout } from "../types";

interface LogEntry {
  blockId: string;
  exerciseId: string;
  roundNumber: number;
  weight: any;
  reps: number | null;
  durationSec: number | null;
}

function hasValue(log: LogEntry): boolean {
  return log.weight !== null || log.reps !== null || log.durationSec !== null;
}

export function isWorkoutComplete(workout: Workout, logs: LogEntry[]): boolean {
  const filledLogs = logs.filter(hasValue);

  for (const block of workout.blocks) {
    if (block.type === "warmup" || block.type === "conditioning_circuit") continue;

    for (const ex of block.exercises) {
      for (let r = 1; r <= block.rounds; r++) {
        const filled = filledLogs.some(
          (l) =>
            l.blockId === block.id &&
            l.exerciseId === ex.exerciseId &&
            l.roundNumber === r
        );
        if (!filled) return false;
      }
    }
  }

  return true;
}
