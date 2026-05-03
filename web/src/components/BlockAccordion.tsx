import { useState, type CSSProperties, type ReactNode } from "react";
import type { HydratedWorkout } from "../api/types";
import { BlockSuperset } from "./blocks/BlockSuperset";
import { BlockConditioning } from "./blocks/BlockConditioning";
import { BlockWarmup } from "./blocks/BlockWarmup";
import { BlockBurnout } from "./blocks/BlockBurnout";
import { useQueryClient } from "@tanstack/react-query";
import { monthOf } from "../lib/dates";

interface BlockAccordionProps {
  workout: HydratedWorkout;
  date: string;
}

type BlockStatus = "not_started" | "in_progress" | "complete";

function getBlockStatus(exercises: HydratedWorkout["blocks"][0]["exercises"]): BlockStatus {
  let total = 0;
  let filled = 0;
  for (const ex of exercises) {
    for (const r of ex.rounds) {
      total++;
      if (r.logged !== null) filled++;
    }
  }
  if (filled === 0) return "not_started";
  if (filled === total) return "complete";
  return "in_progress";
}

function getInitialOpenBlock(workout: HydratedWorkout): string | null {
  // 1. Find first in_progress block
  for (const block of workout.blocks) {
    if (block.type === "warmup") continue;
    const status = getBlockStatus(block.exercises);
    if (status === "in_progress") return block.id;
  }
  // 2. Find first not_started block
  for (const block of workout.blocks) {
    if (block.type === "warmup") continue;
    const status = getBlockStatus(block.exercises);
    if (status === "not_started") return block.id;
  }
  return null;
}

function findNextIncompleteBlock(workout: HydratedWorkout, currentBlockId: string): string | null {
  let found = false;
  for (const block of workout.blocks) {
    if (block.type === "warmup") continue;
    if (block.id === currentBlockId) {
      found = true;
      continue;
    }
    if (!found) continue;
    const status = getBlockStatus(block.exercises);
    if (status !== "complete") return block.id;
  }
  return null;
}

export function BlockAccordion({ workout, date }: BlockAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(() =>
    getInitialOpenBlock(workout)
  );

  const qc = useQueryClient();

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleBlockComplete(blockId: string) {
    // Re-fetch session to get updated log data
    qc.invalidateQueries({ queryKey: ["session", date] });
    qc.invalidateQueries({ queryKey: ["calendar", monthOf(date)] });

    // For auto-advance, find next incomplete block
    const nextBlockId = findNextIncompleteBlock(workout, blockId);
    if (nextBlockId) {
      setExpandedId(nextBlockId);
    } else {
      setExpandedId(null);
    }
  }

  const dividerStyle: CSSProperties = {
    borderTop: "0.5px solid var(--color-border-tertiary)",
  };

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        marginBottom: "12px",
      }}
    >
      {workout.blocks.map((block, idx) => {
        const isExpanded = expandedId === block.id;
        const showDivider = idx > 0;

        let content: ReactNode;

        if (block.type === "warmup") {
          content = (
            <BlockWarmup
              block={block}
              isExpanded={isExpanded}
              onToggle={() => handleToggle(block.id)}
            />
          );
        } else if (block.type === "conditioning_circuit") {
          content = (
            <BlockConditioning
              block={block}
              isExpanded={isExpanded}
              onToggle={() => handleToggle(block.id)}
              onBlockComplete={() => handleBlockComplete(block.id)}
            />
          );
        } else {
          // superset or straight_set
          content = (
            <BlockSuperset
              block={block}
              date={date}
              isExpanded={isExpanded}
              onToggle={() => handleToggle(block.id)}
              onBlockComplete={() => handleBlockComplete(block.id)}
            />
          );
        }

        return (
          <div key={block.id} style={showDivider ? dividerStyle : {}}>
            {content}
          </div>
        );
      })}

      {/* Burnout at bottom */}
      {workout.burnout && (
        <div style={dividerStyle}>
          <BlockBurnout
            burnout={workout.burnout}
            isExpanded={expandedId === "__burnout__"}
            onToggle={() => handleToggle("__burnout__")}
          />
        </div>
      )}
    </div>
  );
}
