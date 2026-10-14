import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeContent: "center", gap: 12, textAlign: "center", padding: 24, background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-family-base)" }}>
      <h1 style={{ fontFamily: "var(--font-family-display)", color: "var(--primary)", margin: 0 }}>Page not found</h1>
      <p style={{ margin: 0, color: "var(--muted-foreground)" }}>This page doesn't exist or has moved.</p>
      <Link to="/" style={{ color: "var(--primary)", fontWeight: 700 }}>Go to the home page</Link>
    </div>
  );
}
