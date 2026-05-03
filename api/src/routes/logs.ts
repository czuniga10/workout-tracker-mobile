import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../prisma";
import { parseDate } from "../lib/dates";
import { getScheduleForUser } from "../config/users";
import { getDayOfWeek } from "../lib/dates";
import { getWorkout } from "../config/workouts";
import { isWorkoutComplete } from "../lib/completion";

interface LogBody {
  date: string;
  blockId: string;
  exerciseId: string;
  roundNumber: number;
  weight?: string | null;
  reps?: number | null;
  durationSec?: number | null;
}

export const logsRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: LogBody }>("/", async (req, reply) => {
    const userId = (req as any).userId as string;
    const { date, blockId, exerciseId, roundNumber, weight, reps, durationSec } = req.body;

    if (!date || !blockId || !exerciseId || typeof roundNumber !== "number") {
      return reply.code(400).send({ error: "validation failed", details: "missing required fields" });
    }

    let parsedDate: Date;
    try {
      parsedDate = parseDate(date);
    } catch {
      return reply.code(400).send({ error: "invalid date" });
    }

    try {
      // Resolve or create session
      const schedule = getScheduleForUser(userId);
      const dow = getDayOfWeek(parsedDate);
      const scheduleDay = schedule.days[dow];

      if (!scheduleDay.workoutId) {
        return reply.code(400).send({ error: "no workout scheduled for this date" });
      }

      let session = await prisma.workoutSession.findUnique({
        where: { userId_date: { userId, date: parsedDate } },
        include: { logs: true },
      });

      if (!session) {
        session = await prisma.workoutSession.create({
          data: {
            userId,
            workoutId: scheduleDay.workoutId,
            date: parsedDate,
            status: "scheduled",
          },
          include: { logs: true },
        });
      }

      // Upsert the log
      const log = await prisma.exerciseLog.upsert({
        where: {
          sessionId_blockId_exerciseId_roundNumber: {
            sessionId: session.id,
            blockId,
            exerciseId,
            roundNumber,
          },
        },
        update: {
          weight: weight != null ? weight : null,
          reps: reps != null ? reps : null,
          durationSec: durationSec != null ? durationSec : null,
        },
        create: {
          sessionId: session.id,
          blockId,
          exerciseId,
          roundNumber,
          weight: weight != null ? weight : null,
          reps: reps != null ? reps : null,
          durationSec: durationSec != null ? durationSec : null,
        },
      });

      // Transition from scheduled -> in_progress
      let newStatus = session.status;
      if (session.status === "scheduled") {
        await prisma.workoutSession.update({
          where: { id: session.id },
          data: { status: "in_progress" },
        });
        newStatus = "in_progress";
      }

      // Check completion
      const updatedLogs = await prisma.exerciseLog.findMany({
        where: { sessionId: session.id },
      });

      const workout = getWorkout(scheduleDay.workoutId);
      if (isWorkoutComplete(workout, updatedLogs as any)) {
        await prisma.workoutSession.update({
          where: { id: session.id },
          data: { status: "complete" },
        });
        newStatus = "complete";
      }

      return reply.send({
        log: {
          id: log.id,
          sessionId: log.sessionId,
          blockId: log.blockId,
          exerciseId: log.exerciseId,
          roundNumber: log.roundNumber,
          weight: log.weight !== null ? log.weight.toString() : null,
          reps: log.reps,
          durationSec: log.durationSec,
        },
        session: {
          id: session.id,
          status: newStatus,
        },
      });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "internal" });
    }
  });
};
