import { useState, useEffect } from "react";

interface GifModalProps {
  exerciseName: string;
  url: string;
  onClose: () => void;
}

export function GifModal({ exerciseName, url, onClose }: GifModalProps) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    setState("loading");
    const img = new Image();
    img.onload = () => setState("loaded");
    img.onerror = () => setState("error");
    img.src = url;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "var(--color-background-primary)",
          borderRadius: "var(--radius-xl)",
          padding: "18px",
          maxWidth: "380px",
          width: "100%",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "0.5px solid var(--color-border-tertiary)",
            background: "transparent",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: 1,
            color: "var(--color-text-secondary)",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          ×
        </button>

        <div
          style={{
            fontSize: "15px",
            fontWeight: 500,
            margin: "0 28px 12px 0",
            textTransform: "capitalize",
            color: "var(--color-text-primary)",
          }}
        >
          {exerciseName}
        </div>

        <div
          style={{
            background: "var(--color-background-tertiary)",
            borderRadius: "var(--radius-md)",
            aspectRatio: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {state === "loading" && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                textAlign: "center",
                padding: "0 16px",
              }}
            >
              Loading…
            </div>
          )}
          {state === "error" && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                textAlign: "center",
                padding: "0 16px",
                lineHeight: 1.5,
              }}
            >
              Demo unavailable
            </div>
          )}
          {state === "loaded" && (
            <img
              src={url}
              alt={exerciseName}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "var(--color-text-tertiary)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Demo via WorkoutX
        </div>
      </div>
    </div>
  );
}
