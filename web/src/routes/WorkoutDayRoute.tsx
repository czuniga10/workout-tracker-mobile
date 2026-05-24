import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { PhoneShell } from "../components/PhoneShell";
import { StatusBar } from "../components/StatusBar";
import { DayNav } from "../components/DayNav";
import { WorkoutHeaderCard } from "../components/WorkoutHeaderCard";
import { BlockAccordion } from "../components/BlockAccordion";
import { NotesDrawer } from "../components/NotesDrawer";
import { useSession } from "../hooks/useSession";
import type { HydratedWorkout } from "../api/types";

function computeRoundProgress(workout: HydratedWorkout): { completed: number; total: number } {
  let completed = 0;
  let total = 0;
  for (const block of workout.blocks) {
    if (block.type === "warmup" || block.type === "conditioning_circuit") continue;
    for (const ex of block.exercises) {
      for (const r of ex.rounds) {
        total++;
        if (r.logged !== null) completed++;
      }
    }
  }
  return { completed, total };
}

export function WorkoutDayRoute() {
  const { date } = useParams<{ date: string }>();
  const dateStr = date ?? format(new Date(), "yyyy-MM-dd");
  const { data, isLoading, error } = useSession(dateStr);

  return (
    <PhoneShell>
      <StatusBar />
      <DayNav date={dateStr} />

      {isLoading && (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--color-text-tertiary)",
            fontSize: "13px",
          }}
        >
          Loading…
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "var(--color-text-warning)",
            fontSize: "13px",
          }}
        >
          Failed to load session
        </div>
      )}

      {data?.kind === "rest" && (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛋️</div>
          <div style={{ fontSize: "16px", fontWeight: 500, marginBottom: "6px" }}>Rest day</div>
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Recovery is part of the program.
          </div>
        </div>
      )}

      {data?.kind === "workout" && (
        <>
          {/* Workout header card */}
          {(() => {
            const { completed, total } = computeRoundProgress(data.workout);
            return (
              <WorkoutHeaderCard
                workout={data.workout}
                completedRounds={completed}
                totalRounds={total}
              />
            );
          })()}

          {/* Workout notes callout */}
          {data.workout.notes && (
            <div
              style={{
                background: "var(--color-background-info)",
                color: "var(--color-text-info)",
                fontSize: "12px",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                marginBottom: "12px",
                lineHeight: 1.5,
              }}
            >
              {data.workout.notes}
            </div>
          )}

          {/* Block accordion */}
          <BlockAccordion workout={data.workout} date={dateStr} sessionStatus={data.session.status} />

          {/* Notes drawer */}
          <NotesDrawer date={dateStr} initialNotes={data.session.notes} />
        </>
      )}
    </PhoneShell>
  );
}
