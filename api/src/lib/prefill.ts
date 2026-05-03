import { prisma } from "../prisma";
import type { Workout } from "../types";
import { formatDate } from "./dates";

export interface PrefillValue {
  weight: string | null;
  reps: number | null;
  durationSec: number | null;
}

export type PrefillMap = Map<string, PrefillValue>;

function slotKey(blockId: string, exerciseId: string, roundNumber: number): string {
  return `${blockId}::${exerciseId}::${roundNumber}`;
}

export async function computePrefill(
  userId: string,
  workoutId: string,
  currentDate: Date,
  workout: Workout
): Promise<PrefillMap> {
  const pastLogs = await prisma.exerciseLog.findMany({
    where: {
      session: {
        userId,
        workoutId,
        date: { lt: currentDate },
      },
    },
    include: {
      session: { select: { date: true } },
    },
    orderBy: [
      { session: { date: "desc" } },
      { updatedAt: "desc" },
    ],
  });

  // Build prefill map: per-field, take first non-null value seen (most recent)
  const prefillMap: PrefillMap = new Map();

  // Track which fields still need filling per slot
  const needed = new Map<string, { weight: boolean; reps: boolean; durationSec: boolean }>();

  // Initialize needed map from workout structure
  for (const block of workout.blocks) {
    for (const ex of block.exercises) {
      for (let r = 1; r <= block.rounds; r++) {
        const key = slotKey(block.id, ex.exerciseId, r);
        needed.set(key, { weight: true, reps: true, durationSec: true });
        prefillMap.set(key, { weight: null, reps: null, durationSec: null });
      }
    }
  }

  for (const log of pastLogs) {
    const key = slotKey(log.blockId, log.exerciseId, log.roundNumber);
    const slot = needed.get(key);
    if (!slot) continue;

    const current = prefillMap.get(key)!;

    if (slot.weight && log.weight !== null) {
      current.weight = log.weight.toString();
      slot.weight = false;
    }
    if (slot.reps && log.reps !== null) {
      current.reps = log.reps;
      slot.reps = false;
    }
    if (slot.durationSec && log.durationSec !== null) {
      current.durationSec = log.durationSec;
      slot.durationSec = false;
    }

    // If all fields are filled, remove from needed
    if (!slot.weight && !slot.reps && !slot.durationSec) {
      needed.delete(key);
    }

    if (needed.size === 0) break;
  }

  return prefillMap;
}

export function getPrefill(map: PrefillMap, blockId: string, exerciseId: string, roundNumber: number): PrefillValue {
  return map.get(slotKey(blockId, exerciseId, roundNumber)) ?? { weight: null, reps: null, durationSec: null };
}
