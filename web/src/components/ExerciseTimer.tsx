import { useState, useEffect, useRef } from "react";

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedCtx) sharedCtx = new AudioContext();
  return sharedCtx;
}

function playChime() {
  const ctx = getAudioContext();
  ctx.resume().then(() => {
    [523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = freq;
      const t = ctx.currentTime + i * 0.15;
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.start(t);
      o.stop(t + 0.2);
    });
  });
}

interface ExerciseTimerProps {
  targetSeconds: number;
  onComplete: (elapsed: number) => void;
}

type TimerState = "idle" | "running" | "paused" | "done";

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExerciseTimer({ targetSeconds, onComplete }: ExerciseTimerProps) {
  const [remaining, setRemaining] = useState(targetSeconds);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerState("done");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  useEffect(() => {
    if (timerState === "done" && !completedRef.current) {
      completedRef.current = true;
      playChime();
      onComplete(targetSeconds);
    }
  }, [timerState, targetSeconds, onComplete]);

  function reset() {
    completedRef.current = false;
    setRemaining(targetSeconds);
    setTimerState("idle");
  }

  const progress = (targetSeconds - remaining) / targetSeconds;
  const isDone = timerState === "done";
  const isRunning = timerState === "running";

  const trackColor = "var(--color-border-tertiary)";
  const fillColor = isDone ? "var(--color-text-success)" : "var(--color-text-info)";
  const timeColor = isDone
    ? "var(--color-text-success)"
    : isRunning
    ? "var(--color-text-info)"
    : "var(--color-text-primary)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Countdown + controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Time display */}
        <span
          style={{
            fontSize: "28px",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: timeColor,
            letterSpacing: "-0.5px",
            minWidth: "72px",
            transition: "color 0.3s ease",
          }}
        >
          {formatTime(remaining)}
        </span>

        {/* Start / Pause */}
        <button
          onClick={() => {
            getAudioContext().resume();
            setTimerState((s) => (s === "running" ? "paused" : "running"));
          }}
          disabled={isDone}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "none",
            background: isDone ? "var(--color-background-success)" : "var(--color-background-info)",
            color: isDone ? "var(--color-text-success)" : "var(--color-text-info)",
            fontSize: "18px",
            cursor: isDone ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isRunning ? "⏸" : isDone ? "✓" : "▶"}
        </button>

        {/* Reset */}
        {timerState !== "idle" && (
          <button
            onClick={reset}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "0.5px solid var(--color-border-tertiary)",
              background: "transparent",
              color: "var(--color-text-tertiary)",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ↺
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "3px",
          background: trackColor,
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: fillColor,
            transition: isRunning ? "width 1s linear" : "none",
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
}
