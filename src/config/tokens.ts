/**
 * Centralized Design System Tokens
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
    destructive: "var(--destructive)",
    muted: "var(--muted)",
    background: "var(--background)",
    foreground: "var(--foreground)",
    border: "var(--border)",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#0ea5e9",
  },
  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    full: "9999px",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
  },
  shadows: {
    subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    elevation: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
  },
  spacing: {
    sidebarWidth: "260px",
    sidebarCollapsedWidth: "72px",
    headerHeight: "64px",
    footerHeight: "48px",
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
