import type { FastifyPluginAsync } from "fastify";
import { hydrate } from "../lib/hydrate";
import { prisma } from "../prisma";
import { parseDate } from "../lib/dates";
import { getScheduleForUser } from "../config/users";
import { getDayOfWeek } from "../lib/dates";

export const sessionsRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/sessions/:date
  app.get<{ Params: { date: string } }>("/:date", async (req, reply) => {
    const userId = (req as any).userId as string;
    const { date } = req.params;

    try {
      parseDate(date); // validate format
    } catch {
      return reply.code(400).send({ error: "invalid date" });
    }

    try {
      const result = await hydrate(userId, date);
      return reply.send(result);
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "internal" });
    }
  });

  // POST /api/sessions/:date/complete
  app.post<{ Params: { date: string } }>("/:date/complete", async (req, reply) => {
    const userId = (req as any).userId as string;
    const { date } = req.params;

    let parsedDate: Date;
    try {
      parsedDate = parseDate(date);
    } catch {
      return reply.code(400).send({ error: "invalid date" });
    }

    try {
      const schedule = getScheduleForUser(userId);
      const dow = getDayOfWeek(parsedDate);
      const scheduleDay = schedule.days[dow];

      if (!scheduleDay.workoutId) {
        return reply.code(404).send({ error: "not found" });
      }

      await prisma.workoutSession.upsert({
        where: { userId_date: { userId, date: parsedDate } },
        update: { status: "complete" },
        create: {
          userId,
          workoutId: scheduleDay.workoutId,
          date: parsedDate,
          status: "complete",
        },
      });

      return reply.send({ ok: true });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "internal" });
    }
  });

  // POST /api/sessions/:date/reset
  app.post<{ Params: { date: string } }>("/:date/reset", async (req, reply) => {
    const userId = (req as any).userId as string;
    const { date } = req.params;

    let parsedDate: Date;
    try {
      parsedDate = parseDate(date);
    } catch {
      return reply.code(400).send({ error: "invalid date" });
    }

    try {
      await prisma.workoutSession.updateMany({
        where: { userId, date: parsedDate },
        data: { status: "scheduled" },
      });
      return reply.send({ ok: true });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "internal" });
    }
  });

  // PUT /api/sessions/:date/notes
  app.put<{ Params: { date: string }; Body: { notes: string } }>(
    "/:date/notes",
    async (req, reply) => {
      const userId = (req as any).userId as string;
      const { date } = req.params;
      const { notes } = req.body;

      if (typeof notes !== "string") {
        return reply.code(400).send({ error: "validation failed", details: "notes must be a string" });
      }

      let parsedDate: Date;
      try {
        parsedDate = parseDate(date);
      } catch {
        return reply.code(400).send({ error: "invalid date" });
      }

      try {
        // Find or determine workoutId for this date
        const schedule = getScheduleForUser(userId);
        const dow = getDayOfWeek(parsedDate);
        const scheduleDay = schedule.days[dow];
        const workoutId = scheduleDay.workoutId ?? "rest";

        let session = await prisma.workoutSession.findUnique({
          where: { userId_date: { userId, date: parsedDate } },
        });

        if (!session) {
          if (!scheduleDay.workoutId) {
            return reply.code(404).send({ error: "not found" });
          }
          session = await prisma.workoutSession.create({
            data: {
              userId,
              workoutId: scheduleDay.workoutId,
              date: parsedDate,
              status: "scheduled",
              notes,
            },
          });
        } else {
          await prisma.workoutSession.update({
            where: { id: session.id },
            data: { notes },
          });
        }

        return reply.send({ ok: true });
      } catch (err) {
        app.log.error(err);
        return reply.code(500).send({ error: "internal" });
      }
    }
  );
};
