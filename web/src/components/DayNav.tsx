import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { parseDate, formatDate, formatDayName, formatShortDay, addDays } from "../lib/dates";

interface DayNavProps {
  date: string;
}

export function DayNav({ date }: DayNavProps) {
  const navigate = useNavigate();
  const parsed = parseDate(date);
  const prev = formatDate(addDays(parsed, -1));
  const next = formatDate(addDays(parsed, 1));

  const dayName = formatDayName(parsed);
  const shortDate = formatShortDay(parsed);

  const btnStyle: CSSProperties = {
    background: "transparent",
    border: "0.5px solid var(--color-border-tertiary)",
    width: "30px",
    height: "30px",
    padding: 0,
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    fontSize: "14px",
    color: "var(--color-text-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "14px",
      }}
    >
      <button style={btnStyle} onClick={() => navigate(`/workout/${prev}`)} aria-label="Previous day">
        ‹
      </button>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>{dayName}</div>
        <div style={{ fontSize: "14px", fontWeight: 500 }}>{shortDate}</div>
      </div>
      <button style={btnStyle} onClick={() => navigate(`/workout/${next}`)} aria-label="Next day">
        ›
      </button>
    </div>
  );
}
