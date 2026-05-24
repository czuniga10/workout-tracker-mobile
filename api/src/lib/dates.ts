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
  const d = new Date(`${s}T00:00:00.000Z`);
  if (isNaN(d.getTime())) throw new Error(`Invalid date: ${s}`);
  return d;
}

export function formatDate(d: Date): string {
  return d.toISOString().substring(0, 10);
}

export function getDayOfWeek(d: Date): DayOfWeek {
  return DOW_MAP[d.getUTCDay()];
}

export function getMonthDates(month: string): Date[] {
  const [yearStr, monStr] = month.split("-");
  const year = Number(yearStr);
  const mon = Number(monStr);
  if (!year || !mon) throw new Error(`Invalid month: ${month}`);
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  return Array.from({ length: daysInMonth }, (_, i) =>
    new Date(Date.UTC(year, mon - 1, i + 1))
  );
}
