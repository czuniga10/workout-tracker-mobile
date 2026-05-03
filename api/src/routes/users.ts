import type { FastifyPluginAsync } from "fastify";
import { users } from "../config/users";

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (_req, reply) => {
    return reply.send(
      users.map((u) => ({ id: u.id, name: u.name, initial: u.initial }))
    );
  });
};
