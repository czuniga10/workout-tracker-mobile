interface BlockBurnoutProps {
  burnout: { name: string; description: string };
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
      color: "var(--color-text-warning)",
      transition: "transform 0.2s ease",
      transform: rotated ? "rotate(180deg)" : "none",
      flexShrink: 0,
      marginLeft: "8px",
    }}
  >
    <path d="M3 5 L7 9 L11 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function BlockBurnout({ burnout, isExpanded, onToggle }: BlockBurnoutProps) {
  return (
    <div>
      <div
        onClick={onToggle}
        style={{ cursor: "pointer", userSelect: "none", padding: "14px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <span
                style={{
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontWeight: 500,
                  background: "var(--color-text-warning)",
                  color: "white",
                }}
              >
                BURNOUT
              </span>
              <span style={{ fontSize: "11px", color: "var(--color-text-warning)" }}>
                Finisher
              </span>
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--color-text-warning)",
              }}
            >
              {burnout.name}
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
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "var(--color-text-warning)",
                lineHeight: 1.6,
              }}
            >
              {burnout.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
