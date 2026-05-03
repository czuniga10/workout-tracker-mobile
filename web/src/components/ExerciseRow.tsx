import { useState, type CSSProperties } from "react";
import type { HydratedExercise, ExerciseTarget } from "../api/types";
import { GifButton } from "./GifButton";
import { GifModal } from "./GifModal";
import { InstructionsModal } from "./InstructionsModal";

interface ExerciseRowProps {
  letter: string;
  hydratedEx: HydratedExercise;
  currentRound: number;
  isActive: boolean;
  value: { weight: string; reps: string; durationSec: string };
  onChange: (field: "weight" | "reps" | "durationSec", val: string) => void;
}

function formatTarget(target: ExerciseTarget): string {
  if (target.type === "reps") {
    const rangeStr = "value" in target ? `${target.value}` : `${target.min}–${target.max}`;
    const perSide = "perSide" in target && target.perSide ? " (each side)" : "";
    return `Target ${rangeStr} reps${perSide}`;
  }
  if (target.type === "time") {
    if ("seconds" in target) return `Target ${target.seconds}s`;
    return `Target ${target.minSeconds}–${target.maxSeconds}s`;
  }
  return "";
}

function formatPrefill(ex: HydratedExercise, round: number): string {
  const r = ex.rounds.find((r) => r.roundNumber === round);
  if (!r) return "";
  const p = r.prefill;
  if (ex.exercise.type === "timed") {
    if (p.durationSec != null) return `Last: ${p.durationSec}s`;
    return "";
  }
  if (p.weight && p.reps) return `Last: ${p.weight} lb × ${p.reps}`;
  if (p.weight) return `Last: ${p.weight} lb`;
  if (p.reps) return `Last: ${p.reps} reps`;
  return "";
}

const inputStyle: CSSProperties = {
  width: "100%",
  height: "34px",
  fontSize: "14px",
  padding: "0 10px",
  border: "0.5px solid var(--color-border-tertiary)",
  borderRadius: "var(--radius-md)",
  background: "var(--color-background-primary)",
  fontFamily: "inherit",
  color: "var(--color-text-primary)",
  outline: "none",
};

export function ExerciseRow({ letter, hydratedEx, currentRound, isActive, value, onChange }: ExerciseRowProps) {
  const [gifOpen, setGifOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const { exercise, target } = hydratedEx;
  const prefillHint = formatPrefill(hydratedEx, currentRound);
  const round = hydratedEx.rounds.find((r) => r.roundNumber === currentRound);
  const isLogged = round?.logged != null;

  const getPrefillPlaceholder = (field: "weight" | "reps" | "durationSec") => {
    const p = round?.prefill;
    if (!p) return "";
    if (field === "weight") return p.weight ?? "";
    if (field === "reps") return p.reps != null ? String(p.reps) : "";
    if (field === "durationSec") return p.durationSec != null ? String(p.durationSec) : "";
    return "";
  };

  const borderColor = isActive ? "var(--color-border-info)" : "var(--color-border-tertiary)";
  const showWeight = exercise.type === "weighted";
  const showReps = target.type === "reps";
  const showDuration = target.type === "time";

  return (
    <>
      <div
        style={{
          borderLeft: `2px solid ${borderColor}`,
          paddingLeft: "10px",
          marginBottom: "12px",
        }}
      >
        {/* Head row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "2px",
          }}
        >
          <span style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {letter}
          </span>
          {prefillHint && (
            <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
              {isLogged ? "Round logged" : prefillHint}
            </span>
          )}
        </div>

        {/* Name row */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500 }}>{exercise.name}</span>
          <GifButton
            gifId={exercise.gifId}
            exerciseName={exercise.name}
            onOpen={() => setGifOpen(true)}
          />
          {exercise.instructions && exercise.instructions.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInfoOpen(true);
              }}
              aria-label={`Show instructions for ${exercise.name}`}
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                border: "0.5px solid var(--color-border-tertiary)",
                background: "var(--color-background-tertiary)",
                color: "var(--color-text-secondary)",
                padding: 0,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "inherit",
              }}
            >
              i
            </button>
          )}
        </div>

        {/* Target + notes */}
        <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
          {formatTarget(target)}
          {hydratedEx.notes ? ` · ${hydratedEx.notes}` : ""}
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", gap: "6px" }}>
          {showWeight && (
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: "var(--color-text-tertiary)", display: "block", marginBottom: "2px" }}>
                Weight (lb)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={value.weight}
                placeholder={getPrefillPlaceholder("weight")}
                onChange={(e) => onChange("weight", e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-border-info)";
                  e.target.style.boxShadow = "0 0 0 2px var(--color-background-info)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border-tertiary)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          )}
          {showReps && (
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: "var(--color-text-tertiary)", display: "block", marginBottom: "2px" }}>
                Reps
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={value.reps}
                placeholder={getPrefillPlaceholder("reps")}
                onChange={(e) => onChange("reps", e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-border-info)";
                  e.target.style.boxShadow = "0 0 0 2px var(--color-background-info)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border-tertiary)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          )}
          {showDuration && (
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: "var(--color-text-tertiary)", display: "block", marginBottom: "2px" }}>
                Duration (s)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={value.durationSec}
                placeholder={getPrefillPlaceholder("durationSec")}
                onChange={(e) => onChange("durationSec", e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-border-info)";
                  e.target.style.boxShadow = "0 0 0 2px var(--color-background-info)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border-tertiary)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      {gifOpen && exercise.gifId && (
        <GifModal
          exerciseName={exercise.name}
          gifId={exercise.gifId}
          onClose={() => setGifOpen(false)}
        />
      )}
      {infoOpen && exercise.instructions && (
        <InstructionsModal
          exerciseName={exercise.name}
          instructions={exercise.instructions}
          onClose={() => setInfoOpen(false)}
        />
      )}
    </>
  );
}
