interface GifButtonProps {
  exerciseDbId: string | null;
  exerciseName: string;
  onOpen: () => void;
}

export function GifButton({ exerciseDbId, exerciseName, onOpen }: GifButtonProps) {
  if (!exerciseDbId) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      aria-label={`Show demo for ${exerciseName}`}
      style={{
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        border: "0.5px solid var(--color-border-tertiary)",
        background: "var(--color-background-tertiary)",
        color: "var(--color-text-info)",
        padding: 0,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor" style={{ marginLeft: "1px" }}>
        <path d="M3.5 2 L11 7 L3.5 12 Z" />
      </svg>
    </button>
  );
}
