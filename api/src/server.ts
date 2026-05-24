import { config } from "dotenv";
config({ path: "../.env" });

import Fastify from "fastify";
import { usersRoutes } from "./routes/users";
import { scheduleRoutes } from "./routes/schedule";
import { sessionsRoutes } from "./routes/sessions";
import { logsRoutes } from "./routes/logs";
import { calendarRoutes } from "./routes/calendar";
import { gifsRoutes } from "./routes/gifs";
import { resolveUserId } from "./lib/userId";

const app = Fastify({ logger: true });

app.decorateRequest("userId", "");
app.addHook("preHandler", async (req, reply) => {
  if (req.url.startsWith("/api/users")) return;
  if (req.url.startsWith("/api/gifs")) return;
  const userId = resolveUserId(req);
  if (!userId) return reply.code(400).send({ error: "missing X-User-Id" });
  (req as any).userId = userId;
});

app.register(usersRoutes,    { prefix: "/api/users" });
app.register(scheduleRoutes, { prefix: "/api/schedule" });
app.register(sessionsRoutes, { prefix: "/api/sessions" });
app.register(logsRoutes,     { prefix: "/api/logs" });
app.register(calendarRoutes, { prefix: "/api/calendar" });
app.register(gifsRoutes,     { prefix: "/api/gifs" });

const port = Number(process.env.PORT ?? 3000);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
