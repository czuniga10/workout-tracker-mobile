import {
  parse,
  format,
  getDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isValid,
} from "date-fns";
import type { DayOfWeek } from "../types";

const DOW_MAP: Record<number, DayOfWeek> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export function parseDate(s: string): Date {
  const d = parse(s, "yyyy-MM-dd", new Date());
  if (!isValid(d)) throw new Error(`Invalid date: ${s}`);
  return d;
}

export function formatDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function getDayOfWeek(d: Date): DayOfWeek {
  return DOW_MAP[getDay(d)];
}

export function getMonthDates(month: string): Date[] {
  const first = parse(month, "yyyy-MM", new Date());
  if (!isValid(first)) throw new Error(`Invalid month: ${month}`);
  return eachDayOfInterval({ start: startOfMonth(first), end: endOfMonth(first) });
}
