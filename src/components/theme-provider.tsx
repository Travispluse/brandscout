// Light mode only — no theme switching needed.
// Kept as a passthrough wrapper for backwards compatibility.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
