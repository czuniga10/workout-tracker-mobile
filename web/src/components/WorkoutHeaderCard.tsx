import type { HydratedWorkout } from "../api/types";

interface WorkoutHeaderCardProps {
  workout: HydratedWorkout;
  completedRounds: number;
  totalRounds: number;
}

export function WorkoutHeaderCard({ workout, completedRounds, totalRounds }: WorkoutHeaderCardProps) {
  const pct = totalRounds > 0 ? (completedRounds / totalRounds) * 100 : 0;

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--radius-lg)",
        padding: "14px",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "2px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 500 }}>{workout.name}</h2>
        <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
          {completedRounds} of {totalRounds} rounds
        </span>
      </div>
      <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginBottom: "10px" }}>
        {workout.focus}
      </div>
      <div
        style={{
          height: "4px",
          background: "var(--color-background-tertiary)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--color-text-info)",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
