"use client";

import { useState } from "react";

export function APISandbox() {
  const [query, setQuery] = useState("mybrandname");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch(`/api/v1/check?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-muted px-4 py-3 flex items-center gap-2">
        <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-xs font-mono">GET</span>
        <span className="text-sm font-mono text-muted-foreground">/api/v1/check?q=</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-2 py-1 text-sm rounded border border-border bg-background font-mono"
          placeholder="brandname"
          aria-label="Brand name to check"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-1.5 text-sm rounded-lg bg-foreground text-background hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
      {error && <p className="px-4 py-2 text-sm text-destructive">{error}</p>}
      {response && (
        <pre className="bg-zinc-950 text-zinc-100 p-4 overflow-x-auto text-sm leading-relaxed max-h-96 overflow-y-auto">
          <code>{response}</code>
        </pre>
      )}
    </div>
  );
}
