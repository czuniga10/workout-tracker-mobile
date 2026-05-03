import { useEffect } from "react";

interface InstructionsModalProps {
  exerciseName: string;
  instructions: string[];
  onClose: () => void;
}

export function InstructionsModal({ exerciseName, instructions, onClose }: InstructionsModalProps) {
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
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
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
            margin: "0 28px 14px 0",
            color: "var(--color-text-primary)",
          }}
        >
          {exerciseName}
        </div>

        <ol
          style={{
            margin: 0,
            paddingLeft: "18px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {instructions.map((step, i) => (
            <li
              key={i}
              style={{
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                marginBottom: i < instructions.length - 1 ? "8px" : 0,
              }}
            >
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
