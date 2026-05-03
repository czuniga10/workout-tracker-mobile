import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../prisma";
import { getMonthDates, formatDate, getDayOfWeek } from "../lib/dates";
import { getScheduleForUser } from "../config/users";

export const calendarRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Querystring: { month: string } }>("/", async (req, reply) => {
    const userId = (req as any).userId as string;
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return reply.code(400).send({ error: "invalid date" });
    }

    try {
      const dates = getMonthDates(month);
      const schedule = getScheduleForUser(userId);

      // Fetch all sessions for the month
      const startDate = dates[0];
      const endDate = dates[dates.length - 1];

      const sessions = await prisma.workoutSession.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: { date: true, status: true, workoutId: true },
      });

      const sessionMap = new Map<string, { status: string; workoutId: string }>();
      for (const s of sessions) {
        sessionMap.set(formatDate(s.date), { status: s.status, workoutId: s.workoutId });
      }

      const days = dates.map((date) => {
        const dateStr = formatDate(date);
        const dow = getDayOfWeek(date);
        const scheduleDay = schedule.days[dow];

        if (!scheduleDay.workoutId) {
          return { date: dateStr, kind: "rest" as const };
        }

        const session = sessionMap.get(dateStr);
        const status = session?.status ?? "scheduled";

        return {
          date: dateStr,
          kind: "workout" as const,
          workoutId: scheduleDay.workoutId,
          label: scheduleDay.label,
          status,
        };
      });

      return reply.send({ month, days });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "internal" });
    }
  });
};
