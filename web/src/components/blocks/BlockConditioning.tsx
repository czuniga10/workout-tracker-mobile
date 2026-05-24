import { useState, type CSSProperties } from "react";
import type { HydratedBlock } from "../../api/types";
import { GifButton } from "../GifButton";
import { GifModal } from "../GifModal";
import { resolveGifUrl } from "../../lib/gifs";

interface BlockConditioningProps {
  block: HydratedBlock;
  isExpanded: boolean;
  onToggle: () => void;
  onBlockComplete: () => void;
}

const ChevronIcon = ({ rotated }: { rotated: boolean }) => (
  <svg
    width="14" height="14" viewBox="0 0 14 14"
    fill="none" stroke="currentColor" strokeWidth="1.5"
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

function formatTarget(ex: HydratedBlock["exercises"][0]): string {
  const t = ex.target;
  const perSide = "perSide" in t && t.perSide ? " each side" : "";
  if (t.type === "reps") {
    const val = "value" in t ? t.value : `${t.min}–${t.max}`;
    return `${val} reps${perSide}`;
  }
  const val = "seconds" in t ? `${t.seconds}s` : `${t.minSeconds}–${t.maxSeconds}s`;
  return val + perSide;
}

export function BlockConditioning({ block, isExpanded, onToggle }: BlockConditioningProps) {
  const [gifEx, setGifEx] = useState<{ name: string; url: string } | null>(null);

  const badgeStyle: CSSProperties = {
    fontSize: "11px", padding: "1px 6px", borderRadius: "4px", fontWeight: 500,
    background: "var(--color-background-info)", color: "var(--color-text-info)",
  };

  return (
    <div>
      <div onClick={onToggle} style={{ cursor: "pointer", userSelect: "none", padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <span style={badgeStyle}>CIRCUIT</span>
              <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                {block.rounds} rounds · {block.restSeconds}s{block.priority ? ` · ${block.priority}` : ""}
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 500 }}>
              {block.exercises.map((ex) => ex.exercise.name.split(" ").slice(0, 2).join(" ")).join(" · ")}
            </div>
          </div>
          <ChevronIcon rotated={isExpanded} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateRows: isExpanded ? "1fr" : "0fr", transition: "grid-template-rows 0.25s ease" }}>
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <div style={{ padding: "0 14px 14px" }}>
            <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", margin: "0 0 12px" }}>
              {block.rounds} rounds — complete all exercises, rest {block.restSeconds}s between rounds
            </p>
            {block.exercises.map((ex, idx) => (
              <div
                key={ex.exercise.id}
                style={{
                  borderLeft: "2px solid var(--color-border-tertiary)",
                  paddingLeft: "10px",
                  marginBottom: idx < block.exercises.length - 1 ? "12px" : 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{ex.exercise.name}</span>
                  <GifButton
                    gifUrl={resolveGifUrl(ex.exercise)}
                    exerciseName={ex.exercise.name}
                    onOpen={() => { const u = resolveGifUrl(ex.exercise); if (u) setGifEx({ name: ex.exercise.name, url: u }); }}
                  />
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-info)", fontWeight: 500 }}>
                  {formatTarget(ex)}
                </div>
                {ex.notes && (
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                    {ex.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {gifEx && <GifModal exerciseName={gifEx.name} url={gifEx.url} onClose={() => setGifEx(null)} />}
    </div>
  );
}
