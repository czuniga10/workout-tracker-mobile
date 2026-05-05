import { useState, useEffect, type CSSProperties } from "react";
import type { HydratedBlock } from "../../api/types";
import { ExerciseRow } from "../ExerciseRow";
import { useUpsertLog } from "../../hooks/useUpsertLog";

interface BlockSupersetProps {
  block: HydratedBlock;
  date: string;
  isExpanded: boolean;
  onToggle: () => void;
  onBlockComplete: () => void;
}

type BlockStatus = "not_started" | "in_progress" | "complete";

function getBlockStatus(block: HydratedBlock): BlockStatus {
  let totalSlots = 0;
  let filledSlots = 0;
  for (const ex of block.exercises) {
    for (const r of ex.rounds) {
      totalSlots++;
      if (r.logged !== null) filledSlots++;
    }
  }
  if (filledSlots === 0) return "not_started";
  if (filledSlots === totalSlots) return "complete";
  return "in_progress";
}

function getRoundStatus(block: HydratedBlock, roundNum: number): "complete" | "active" | "idle" {
  const allLogged = block.exercises.every((ex) => {
    const r = ex.rounds.find((r) => r.roundNumber === roundNum);
    return r?.logged !== null;
  });
  if (allLogged) return "complete";

  // Find the lowest round that isn't complete
  for (let r = 1; r <= block.rounds; r++) {
    const roundComplete = block.exercises.every((ex) => {
      const round = ex.rounds.find((rr) => rr.roundNumber === r);
      return round?.logged !== null;
    });
    if (!roundComplete) {
      return r === roundNum ? "active" : "idle";
    }
  }
  return "idle";
}

function getCurrentRound(block: HydratedBlock): number {
  for (let r = 1; r <= block.rounds; r++) {
    const allLogged = block.exercises.every((ex) => {
      const round = ex.rounds.find((rr) => rr.roundNumber === r);
      return round?.logged !== null;
    });
    if (!allLogged) return r;
  }
  return block.rounds;
}

function formatBlockLabel(block: HydratedBlock): string {
  return block.type === "straight_set" ? "STRAIGHT SET" : "SUPERSET";
}

function formatBlockTitle(block: HydratedBlock): string {
  if (block.exercises.length === 1) {
    return block.exercises[0].exercise.name;
  }
  const names = block.exercises.map((ex) => {
    const parts = ex.exercise.name.split(" ");
    return parts.slice(0, 3).join(" ");
  });
  return names.join(" + ");
}

function formatMeta(block: HydratedBlock): string {
  const base = `${block.rounds} rounds · ${block.restSeconds}s`;
  if (block.priority) return `${base} · ${block.priority}`;
  return base;
}

const ChevronIcon = ({ rotated }: { rotated: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{
      color: "var(--color-text-tertiary)",
      transition: "transform 0.2s ease",
      transform: rotated ? "rotate(180deg)" : "none",
      flexShrink: 0,
      marginLeft: "8px",
    }}
  >
    <path d="M3 5 L7 9 L11 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type InputValues = Record<string, { weight: string; reps: string; durationSec: string }>;

export function BlockSuperset({ block, date, isExpanded, onToggle, onBlockComplete }: BlockSupersetProps) {
  const blockStatus = getBlockStatus(block);
  const [selectedRound, setSelectedRound] = useState(() => getCurrentRound(block));
  const upsertLog = useUpsertLog(date);

  const selectedRoundIsLogged = block.exercises.every((ex) => {
    const round = ex.rounds.find((r) => r.roundNumber === selectedRound);
    return round?.logged != null;
  });

  // Input state per exercise
  const [inputValues, setInputValues] = useState<InputValues>(() => {
    const init: InputValues = {};
    for (const ex of block.exercises) {
      init[ex.exercise.id] = { weight: "", reps: "", durationSec: "" };
    }
    return init;
  });

  // Update selected round when block status changes externally
  useEffect(() => {
    setSelectedRound(getCurrentRound(block));
  }, [block]);

  // Prefill inputs from the selected round's logged or prefill values
  useEffect(() => {
    const newValues: InputValues = {};
    for (const ex of block.exercises) {
      const round = ex.rounds.find((r) => r.roundNumber === selectedRound);
      if (round?.logged) {
        newValues[ex.exercise.id] = {
          weight: round.logged.weight ?? "",
          reps: round.logged.reps != null ? String(round.logged.reps) : "",
          durationSec: round.logged.durationSec != null ? String(round.logged.durationSec) : "",
        };
      } else {
        newValues[ex.exercise.id] = { weight: "", reps: "", durationSec: "" };
      }
    }
    setInputValues(newValues);
  }, [selectedRound, block]);

  function handleCopyPrevious() {
    const prevRound = selectedRound - 1;
    const newValues: InputValues = { ...inputValues };
    for (const ex of block.exercises) {
      const prev = ex.rounds.find((r) => r.roundNumber === prevRound);
      if (prev?.logged) {
        newValues[ex.exercise.id] = {
          weight: prev.logged.weight ?? "",
          reps: prev.logged.reps != null ? String(prev.logged.reps) : "",
          durationSec: prev.logged.durationSec != null ? String(prev.logged.durationSec) : "",
        };
      }
    }
    setInputValues(newValues);
  }

  function handleLog() {
    const mutations = block.exercises.map((ex) => {
      const vals = inputValues[ex.exercise.id] ?? { weight: "", reps: "", durationSec: "" };
      return upsertLog.mutateAsync({
        date,
        blockId: block.id,
        exerciseId: ex.exercise.id,
        roundNumber: selectedRound,
        weight: vals.weight || null,
        reps: vals.reps ? parseInt(vals.reps, 10) : null,
        durationSec: vals.durationSec ? parseInt(vals.durationSec, 10) : null,
      });
    });

    Promise.all(mutations).then(() => {
      if (selectedRoundIsLogged) return;

      const allRoundsDone = block.exercises.every((ex) =>
        ex.rounds.every((r) => r.roundNumber === selectedRound || r.logged !== null)
      );

      if (allRoundsDone) {
        onBlockComplete();
      } else if (selectedRound < block.rounds) {
        setSelectedRound((r) => r + 1);
      }
    });
  }

  const badgeStyle = (status: BlockStatus): CSSProperties => {
    if (status === "complete")
      return {
        fontSize: "11px",
        padding: "1px 6px",
        borderRadius: "4px",
        fontWeight: 500,
        background: "var(--color-background-success)",
        color: "var(--color-text-success)",
      };
    if (status === "in_progress")
      return {
        fontSize: "11px",
        padding: "1px 6px",
        borderRadius: "4px",
        fontWeight: 500,
        background: "var(--color-background-info)",
        color: "var(--color-text-info)",
      };
    return {
      fontSize: "11px",
      padding: "1px 6px",
      borderRadius: "4px",
      fontWeight: 500,
      background: "var(--color-background-tertiary)",
      color: "var(--color-text-secondary)",
    };
  };

  const isActive = blockStatus === "in_progress";
  const isNotStarted = blockStatus === "not_started";

  return (
    <div>
      {/* Summary (header) */}
      <div
        onClick={onToggle}
        style={{ cursor: "pointer", userSelect: "none", padding: "14px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <span style={badgeStyle(blockStatus)}>{formatBlockLabel(block)}</span>
              <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                {formatMeta(block)}
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 500 }}>{formatBlockTitle(block)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {/* Pips */}
            <div style={{ display: "flex", gap: "3px", marginLeft: "10px" }}>
              {Array.from({ length: block.rounds }, (_, i) => {
                const r = i + 1;
                const rs = getRoundStatus(block, r);
                let bg = "var(--color-border-tertiary)";
                if (rs === "complete") bg = "var(--color-text-success)";
                else if (rs === "active") bg = "var(--color-text-info)";
                return (
                  <span
                    key={r}
                    style={{ width: "7px", height: "7px", borderRadius: "50%", background: bg }}
                  />
                );
              })}
            </div>
            <ChevronIcon rotated={isExpanded} />
          </div>
        </div>
      </div>

      {/* Expandable body */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          transition: "grid-template-rows 0.25s ease",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <div style={{ padding: "0 14px 14px" }}>
            {/* Round selector */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "14px", alignItems: "center" }}>
              {Array.from({ length: block.rounds }, (_, i) => {
                const r = i + 1;
                const rs = getRoundStatus(block, r);
                let btnStyle: CSSProperties = {
                  flex: 1,
                  padding: "6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                };
                if (rs === "complete") {
                  btnStyle = {
                    ...btnStyle,
                    border: "0.5px solid var(--color-border-tertiary)",
                    background: "var(--color-background-success)",
                    color: "var(--color-text-success)",
                  };
                } else if (r === selectedRound) {
                  btnStyle = {
                    ...btnStyle,
                    border: "1px solid var(--color-border-info)",
                    background: "var(--color-background-info)",
                    color: "var(--color-text-info)",
                    fontWeight: 500,
                  };
                } else {
                  btnStyle = {
                    ...btnStyle,
                    border: "0.5px solid var(--color-border-tertiary)",
                    background: "transparent",
                    color: "var(--color-text-secondary)",
                  };
                }
                return (
                  <button key={r} style={btnStyle} onClick={() => setSelectedRound(r)}>
                    {rs === "complete" ? `R${r} ✓` : `R${r}`}
                  </button>
                );
              })}
              {selectedRound > 1 && (
                <button
                  onClick={handleCopyPrevious}
                  style={{
                    background: "none",
                    border: "none",
                    borderLeft: "1.5px dashed var(--color-border-tertiary)",
                    padding: "4px 0 4px 10px",
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  copy R{selectedRound - 1}
                </button>
              )}
            </div>

            {/* Exercise rows */}
            {block.exercises.map((ex, idx) => (
              <div key={ex.exercise.id}>
                <ExerciseRow
                  letter={String.fromCharCode(65 + idx)}
                  hydratedEx={ex}
                  currentRound={selectedRound}
                  isActive={isActive}
                  value={inputValues[ex.exercise.id] ?? { weight: "", reps: "", durationSec: "" }}
                  onChange={(field, val) =>
                    setInputValues((prev) => ({
                      ...prev,
                      [ex.exercise.id]: { ...prev[ex.exercise.id], [field]: val },
                    }))
                  }
                />
                {/* Superset divider between exercises */}
                {block.type === "superset" && idx < block.exercises.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      margin: "0 0 12px",
                    }}
                  >
                    <div style={{ flex: 1, height: "0.5px", background: "var(--color-border-tertiary)" }} />
                    <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-tertiary)" }}>
                      + superset
                    </span>
                    <div style={{ flex: 1, height: "0.5px", background: "var(--color-border-tertiary)" }} />
                  </div>
                )}
              </div>
            ))}

            {/* CTA button */}
            {isNotStarted ? (
              <button
                onClick={handleLog}
                disabled={upsertLog.isPending}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: "transparent",
                  color: "var(--color-text-secondary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Start block
              </button>
            ) : selectedRoundIsLogged ? (
              <button
                onClick={handleLog}
                disabled={upsertLog.isPending}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: "var(--color-text-info)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  opacity: upsertLog.isPending ? 0.7 : 1,
                }}
              >
                Update round {selectedRound}
              </button>
            ) : (
              <button
                onClick={handleLog}
                disabled={upsertLog.isPending}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: "var(--color-text-info)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  opacity: upsertLog.isPending ? 0.7 : 1,
                }}
              >
                Log round {selectedRound} → rest {block.restSeconds}s
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
