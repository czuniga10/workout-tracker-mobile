import { useState, type CSSProperties } from "react";
import { format, addMonths, subMonths, isSameMonth, isToday, getDate } from "date-fns";
import { getCalendarDays, formatDate, formatMonth } from "../lib/dates";
import { useCalendar } from "../hooks/useCalendar";
import { DayCell } from "./DayCell";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function Calendar() {
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const monthStr = formatMonth(visibleMonth);
  const { data } = useCalendar(monthStr);

  const calDays = getCalendarDays(visibleMonth);

  const dayMap = new Map<string, { kind: "workout" | "rest"; status?: string }>();
  if (data) {
    for (const d of data.days) {
      dayMap.set(d.date, { kind: d.kind, status: d.status });
    }
  }

  const btnStyle: CSSProperties = {
    background: "transparent",
    border: "0.5px solid var(--color-border-tertiary)",
    width: "28px",
    height: "28px",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    color: "var(--color-text-primary)",
    fontSize: "14px",
    padding: 0,
    lineHeight: 1,
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 12px 14px",
        marginBottom: "18px",
      }}
    >
      {/* Month nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
          padding: "0 4px",
        }}
      >
        <button style={btnStyle} onClick={() => setVisibleMonth((m) => subMonths(m, 1))} aria-label="Previous month">
          ‹
        </button>
        <div style={{ fontSize: "16px", fontWeight: 500, letterSpacing: "0.2px" }}>
          {format(visibleMonth, "MMMM yyyy")}
        </div>
        <button style={btnStyle} onClick={() => setVisibleMonth((m) => addMonths(m, 1))} aria-label="Next month">
          ›
        </button>
      </div>

      {/* Weekday header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "6px" }}>
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: "10px",
              color: "var(--color-text-tertiary)",
              fontWeight: 500,
              letterSpacing: "0.5px",
              padding: "4px 0",
              textTransform: "uppercase",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {calDays.map((day) => {
          const dateStr = formatDate(day);
          const info = dayMap.get(dateStr);
          const otherMonth = !isSameMonth(day, visibleMonth);
          return (
            <DayCell
              key={dateStr}
              date={dateStr}
              dayNumber={getDate(day)}
              kind={info?.kind ?? "rest"}
              status={info?.status as any}
              isToday={isToday(day)}
              isOtherMonth={otherMonth}
            />
          );
        })}
      </div>
    </div>
  );
}
