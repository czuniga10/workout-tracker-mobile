import { useUsers } from "../hooks/useUsers";
import { useUser } from "../hooks/useUser";

export function UserDropdown() {
  const { data: users, isLoading } = useUsers();
  const { setUser } = useUser();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-background-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--radius-xl)",
          padding: "28px 24px",
          width: "100%",
          maxWidth: "320px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--color-text-primary)",
          }}
        >
          Who are you?
        </h2>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: "13px",
            color: "var(--color-text-secondary)",
          }}
        >
          Select your profile to continue
        </p>

        {isLoading && (
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>Loading…</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {users?.map((user) => (
            <button
              key={user.id}
              onClick={() => setUser(user.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                background: "var(--color-background-tertiary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "var(--color-text-primary)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--color-background-info)",
                  color: "var(--color-text-info)",
                  border: "0.5px solid var(--color-border-info)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {user.initial}
              </span>
              {user.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
