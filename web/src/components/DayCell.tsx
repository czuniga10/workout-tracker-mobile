import { useNavigate } from "react-router-dom";

interface DayCellProps {
  date: string;
  dayNumber: number;
  kind: "workout" | "rest";
  status?: "scheduled" | "in_progress" | "complete";
  isToday: boolean;
  isOtherMonth: boolean;
}

export function DayCell({ date, dayNumber, kind, status, isToday, isOtherMonth }: DayCellProps) {
  const navigate = useNavigate();

  let dotColor: string | null = null;
  if (!isOtherMonth && kind === "workout") {
    if (status === "complete") dotColor = "var(--color-text-success)";
    else if (status === "in_progress" || status === "scheduled") dotColor = "var(--color-text-info)";
  }

  return (
    <div
      onClick={() => navigate(`/workout/${date}`)}
      style={{
        aspectRatio: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius: "var(--radius-md)",
        userSelect: "none",
        paddingTop: "2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          fontSize: "13px",
          background: isToday ? "var(--color-text-info)" : "transparent",
          color: isToday
            ? "#0a0a0c"
            : isOtherMonth
            ? "var(--color-text-tertiary)"
            : "var(--color-text-primary)",
          fontWeight: isToday ? 500 : 400,
          opacity: isOtherMonth ? 0.4 : 1,
        }}
      >
        {dayNumber}
      </div>
      <div
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          marginTop: "4px",
          background: dotColor ?? "transparent",
          visibility: dotColor ? "visible" : "hidden",
        }}
      />
    </div>
  );
}
