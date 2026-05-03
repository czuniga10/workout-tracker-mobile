import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";

export function formatDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function parseDate(s: string): Date {
  return parse(s, "yyyy-MM-dd", new Date());
}

export function formatMonth(d: Date): string {
  return format(d, "yyyy-MM");
}

export function formatMonthLabel(d: Date): string {
  return format(d, "MMMM yyyy");
}

export function formatDayLabel(d: Date): string {
  return format(d, "EEE MMM d");
}

export function formatDayName(d: Date): string {
  return format(d, "EEEE");
}

export function formatShortDay(d: Date): string {
  return format(d, "MMM d");
}

export function getWeekDays(d: Date): Date[] {
  const start = startOfWeek(d, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(d, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function getCalendarDays(month: Date): Date[] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  // Pad start to Sunday
  const paddedStart = startOfWeek(start, { weekStartsOn: 0 });
  // Pad end to Saturday
  const paddedEnd = endOfWeek(end, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: paddedStart, end: paddedEnd });
}

export function monthOf(dateStr: string): string {
  return dateStr.substring(0, 7);
}

export { isToday, isSameMonth, addDays, addMonths, subMonths, format, getDay };
