import type { User } from "../types";
import { chadSchedule } from "./schedules/chad";
import { chelseaSchedule } from "./schedules/chelsea";
import type { Schedule } from "../types";

export const users: User[] = [
  { id: "chad",    name: "Chad",    initial: "C", scheduleId: "chad" },
  { id: "chelsea", name: "Chelsea", initial: "C", scheduleId: "chelsea" },
];

export const schedules: Record<string, Schedule> = {
  chad:    chadSchedule,
  chelsea: chelseaSchedule,
};

export function getUser(id: string) {
  const u = users.find((x) => x.id === id);
  if (!u) throw new Error(`Unknown user: ${id}`);
  return u;
}

export function getScheduleForUser(userId: string) {
  const user = getUser(userId);
  const schedule = schedules[user.scheduleId];
  if (!schedule) throw new Error(`Unknown schedule: ${user.scheduleId}`);
  return schedule;
}
