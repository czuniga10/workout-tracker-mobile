import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   "var(--color-background-primary)",
          secondary: "var(--color-background-secondary)",
          tertiary:  "var(--color-background-tertiary)",
          info:      "var(--color-background-info)",
          success:   "var(--color-background-success)",
          warning:   "var(--color-background-warning)",
        },
        fg: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary:  "var(--color-text-tertiary)",
          info:      "var(--color-text-info)",
          success:   "var(--color-text-success)",
          warning:   "var(--color-text-warning)",
        },
        border: {
          subtle:  "var(--color-border-tertiary)",
          info:    "var(--color-border-info)",
          warning: "var(--color-border-warning)",
        },
      },
      borderRadius: {
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [],
} satisfies Config;
