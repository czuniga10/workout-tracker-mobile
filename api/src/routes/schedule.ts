import type { FastifyPluginAsync } from "fastify";
import { getScheduleForUser } from "../config/users";

export const scheduleRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (req, reply) => {
    const userId = (req as any).userId as string;
    try {
      const schedule = getScheduleForUser(userId);
      return reply.send({ userId, days: schedule.days });
    } catch (err) {
      return reply.code(500).send({ error: "internal" });
    }
  });
};
