import { useUser } from "../hooks/useUser";

export function Avatar() {
  const { userId, clearUser } = useUser();
  const initial = userId ? userId[0].toUpperCase() : "?";

  return (
    <button
      onClick={clearUser}
      aria-label="Switch user"
      style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        background: "var(--color-background-info)",
        color: "var(--color-text-info)",
        border: "0.5px solid var(--color-border-info)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 500,
        cursor: "pointer",
        padding: 0,
        fontFamily: "inherit",
      }}
    >
      {initial}
    </button>
  );
}
