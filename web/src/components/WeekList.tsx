import { useNavigate } from "react-router-dom";
import { format, isToday, getDate } from "date-fns";
import { getWeekDays, formatDate, formatMonth } from "../lib/dates";
import { useCalendar } from "../hooks/useCalendar";

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekList() {
  const navigate = useNavigate();
  const today = new Date();
  const weekDays = getWeekDays(today);
  const monthStr = formatMonth(today);
  const prevMonthStr = formatMonth(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const weekSpansPrevMonth = formatMonth(weekDays[0]) !== monthStr;
  const { data } = useCalendar(monthStr);
  const { data: prevData } = useCalendar(weekSpansPrevMonth ? prevMonthStr : monthStr);

  const dayMap = new Map<string, { kind: string; label?: string; status?: string }>();
  for (const src of [prevData, data]) {
    if (src) {
      for (const d of src.days) {
        dayMap.set(d.date, { kind: d.kind, label: d.label, status: d.status });
      }
    }
  }

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {weekDays.map((day, i) => {
        const dateStr = formatDate(day);
        const info = dayMap.get(dateStr);
        const today_ = isToday(day);
        const isRest = !info || info.kind === "rest";
        const dowLabel = DOW_LABELS[i];
        const label = isRest ? "Rest" : (info?.label ?? "Workout");
        const status = info?.status;

        return (
          <div
            key={dateStr}
            onClick={() => navigate(`/workout/${dateStr}`)}
            style={{
              display: "grid",
              gridTemplateColumns: "36px 26px 1fr 22px",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              borderBottom: i < 6 ? "0.5px solid var(--color-border-tertiary)" : "none",
              cursor: "pointer",
              background: today_ ? "var(--color-background-info)" : "transparent",
            }}
          >
            {/* Day of week */}
            <span
              style={{
                fontSize: "11px",
                color: today_ ? "var(--color-text-info)" : "var(--color-text-tertiary)",
                fontWeight: 500,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {dowLabel}
            </span>

            {/* Date number */}
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: today_ ? "var(--color-text-info)" : "var(--color-text-primary)",
              }}
            >
              {getDate(day)}
            </span>

            {/* Workout label */}
            <span
              style={{
                fontSize: "13px",
                color: isRest
                  ? "var(--color-text-tertiary)"
                  : today_
                  ? "var(--color-text-primary)"
                  : "var(--color-text-primary)",
                fontWeight: today_ ? 500 : 400,
              }}
            >
              {label}
            </span>

            {/* Status indicator */}
            <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              {!isRest && status === "complete" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--color-text-success)" strokeWidth="2">
                  <path d="M3 7 L6 10 L11 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {!isRest && status === "in_progress" && (
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--color-text-info)",
                    boxShadow: "0 0 0 4px var(--color-background-info)",
                  }}
                />
              )}
              {!isRest && status === "scheduled" && (
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--color-text-info)",
                  }}
                />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
