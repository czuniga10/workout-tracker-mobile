import { useState } from "react";
import type { HydratedBlock } from "../../api/types";
import { GifButton } from "../GifButton";
import { GifModal } from "../GifModal";

interface BlockWarmupProps {
  block: HydratedBlock;
  isExpanded: boolean;
  onToggle: () => void;
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

export function BlockWarmup({ block, isExpanded, onToggle }: BlockWarmupProps) {
  const [gifEx, setGifEx] = useState<{ name: string; id: string } | null>(null);

  const previewNames = block.exercises
    .slice(0, 2)
    .map((ex) => ex.exercise.name)
    .join(", ");

  function formatTarget(ex: (typeof block.exercises)[0]): string {
    const t = ex.target;
    if (t.type === "reps") {
      const rep = "value" in t ? t.value : `${t.min}–${t.max}`;
      return `${rep} reps${("perSide" in t && t.perSide) ? " each side" : ""}`;
    }
    if (t.type === "time") {
      if ("seconds" in t) return `${t.seconds}s`;
      return `${t.minSeconds}–${t.maxSeconds}s`;
    }
    return "";
  }

  return (
    <div>
      <div onClick={onToggle} style={{ cursor: "pointer", userSelect: "none", padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <span
                style={{
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontWeight: 500,
                  background: "var(--color-background-tertiary)",
                  color: "var(--color-text-secondary)",
                }}
              >
                WARMUP
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
              {previewNames}
            </div>
          </div>
          <ChevronIcon rotated={isExpanded} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          transition: "grid-template-rows 0.25s ease",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <div style={{ padding: "0 14px 14px" }}>
            {block.exercises.map((ex, idx) => (
              <div
                key={ex.exercise.id}
                style={{
                  borderLeft: "2px solid var(--color-border-tertiary)",
                  paddingLeft: "10px",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{ex.exercise.name}</span>
                  <GifButton
                    gifId={ex.exercise.gifId}
                    exerciseName={ex.exercise.name}
                    onOpen={() => setGifEx({ name: ex.exercise.name, id: ex.exercise.gifId! })}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                  {formatTarget(ex)}
                  {ex.notes ? ` · ${ex.notes}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {gifEx && (
        <GifModal
          exerciseName={gifEx.name}
          gifId={gifEx.id}
          onClose={() => setGifEx(null)}
        />
      )}
    </div>
  );
}
