import type { FastifyRequest } from "fastify";
import { users } from "../config/users";

export function resolveUserId(req: FastifyRequest): string | null {
  const raw = req.headers["x-user-id"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  if (!users.some((u) => u.id === value)) return null;
  return value;
}
