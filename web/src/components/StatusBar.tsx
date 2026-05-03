import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";

export function StatusBar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "14px",
        fontSize: "11px",
        color: "var(--color-text-secondary)",
      }}
    >
      <button
        onClick={() => navigate("/")}
        aria-label="Go to calendar"
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "var(--color-text-secondary)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="14" height="13" rx="2" />
          <path d="M2 7h14" />
          <path d="M6 1v4M12 1v4" />
          <rect x="5" y="10" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
          <rect x="8" y="10" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
          <rect x="11" y="10" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>Workout</span>
      <Avatar />
    </div>
  );
}
