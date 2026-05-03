import { prisma } from "../prisma";
import { getDayOfWeek, parseDate, formatDate } from "./dates";
import { computePrefill, getPrefill } from "./prefill";
import { getScheduleForUser } from "../config/users";
import { getWorkout } from "../config/workouts";
import { getExercise } from "../config/exercises";
import type { Workout, Exercise, ExerciseTarget } from "../types";

export interface RoundData {
  roundNumber: number;
  logged: {
    weight: string | null;
    reps: number | null;
    durationSec: number | null;
  } | null;
  prefill: {
    weight: string | null;
    reps: number | null;
    durationSec: number | null;
  };
}

export interface HydratedExercise {
  exercise: Exercise;
  target: ExerciseTarget;
  notes?: string;
  rounds: RoundData[];
}

export interface HydratedBlock {
  id: string;
  type: string;
  rounds: number;
  restSeconds: number;
  priority?: string;
  exercises: HydratedExercise[];
}

export interface HydratedWorkout {
  id: string;
  name: string;
  focus: string;
  notes: string;
  blocks: HydratedBlock[];
  burnout?: { name: string; description: string };
}

export type HydrateResult =
  | { kind: "rest"; date: string }
  | {
      kind: "workout";
      session: {
        id: string;
        userId: string;
        date: string;
        workoutId: string;
        status: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
      };
      workout: HydratedWorkout;
    };

export async function hydrate(userId: string, dateStr: string): Promise<HydrateResult> {
  const date = parseDate(dateStr);
  const dow = getDayOfWeek(date);
  const schedule = getScheduleForUser(userId);
  const scheduleDay = schedule.days[dow];

  if (!scheduleDay.workoutId) {
    return { kind: "rest", date: dateStr };
  }

  const workout = getWorkout(scheduleDay.workoutId);

  // Fetch or create session
  let session = await prisma.workoutSession.findUnique({
    where: { userId_date: { userId, date } },
    include: { logs: true },
  });

  if (!session) {
    session = await prisma.workoutSession.create({
      data: {
        userId,
        workoutId: scheduleDay.workoutId,
        date,
        status: "scheduled",
      },
      include: { logs: true },
    });
  }

  // Compute prefill from past sessions
  const prefillMap = await computePrefill(userId, scheduleDay.workoutId, date, workout);

  // Build hydrated workout
  const hydratedBlocks: HydratedBlock[] = workout.blocks.map((block) => {
    const hydratedExercises: HydratedExercise[] = block.exercises.map((blockEx) => {
      const exercise = getExercise(blockEx.exerciseId);

      const rounds: RoundData[] = [];
      for (let r = 1; r <= block.rounds; r++) {
        const log = session!.logs.find(
          (l) => l.blockId === block.id && l.exerciseId === blockEx.exerciseId && l.roundNumber === r
        );

        const prefill = getPrefill(prefillMap, block.id, blockEx.exerciseId, r);

        rounds.push({
          roundNumber: r,
          logged: log
            ? {
                weight: log.weight !== null ? log.weight.toString() : null,
                reps: log.reps,
                durationSec: log.durationSec,
              }
            : null,
          prefill,
        });
      }

      return {
        exercise,
        target: blockEx.target,
        notes: blockEx.notes,
        rounds,
      };
    });

    return {
      id: block.id,
      type: block.type,
      rounds: block.rounds,
      restSeconds: block.restSeconds,
      priority: block.priority,
      exercises: hydratedExercises,
    };
  });

  return {
    kind: "workout",
    session: {
      id: session.id,
      userId: session.userId,
      date: formatDate(session.date),
      workoutId: session.workoutId,
      status: session.status,
      notes: session.notes,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    },
    workout: {
      id: workout.id,
      name: workout.name,
      focus: workout.focus,
      notes: workout.notes,
      blocks: hydratedBlocks,
      burnout: workout.burnout,
    },
  };
}
