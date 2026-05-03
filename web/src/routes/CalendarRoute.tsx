import { PhoneShell } from "../components/PhoneShell";
import { StatusBar } from "../components/StatusBar";
import { Calendar } from "../components/Calendar";
import { WeekList } from "../components/WeekList";

export function CalendarRoute() {
  return (
    <PhoneShell>
      <StatusBar />
      <Calendar />
      <div
        style={{
          fontSize: "11px",
          color: "var(--color-text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          fontWeight: 500,
          margin: "0 0 8px 4px",
        }}
      >
        This week
      </div>
      <WeekList />
    </PhoneShell>
  );
}
