import type { FastifyInstance } from "fastify";

const WORKOUTX_KEY = process.env.WORKOUTX_KEY ?? "";

export async function gifsRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const { id } = req.params;
    const url = `https://api.workoutxapp.com/v1/gifs/${encodeURIComponent(id)}.gif`;

    const upstream = await fetch(url, {
      headers: { "X-WorkoutX-Key": WORKOUTX_KEY },
    });

    if (!upstream.ok) {
      return reply.code(upstream.status).send({ error: "gif not found" });
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    reply
      .header("Content-Type", "image/gif")
      .header("Cache-Control", "public, max-age=86400")
      .send(buf);
  });
}
