import type { ReactNode } from "react";

interface PhoneShellProps {
  children: ReactNode;
}

export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-background-secondary)",
        padding: "18px 14px 22px",
      }}
    >
      {children}
    </div>
  );
}
