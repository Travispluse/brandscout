"use client";

import { useState, useEffect } from "react";
import { suggestCorrection } from "@/lib/spell-check";

export function SpellSuggestion({ query, onAccept }: { query: string; onAccept: (corrected: string) => void }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 3) { setSuggestion(null); return; }
    const timer = setTimeout(() => {
      setSuggestion(suggestCorrection(query));
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  if (!suggestion) return null;

  return (
    <p className="text-sm text-muted-foreground mt-1">
      Did you mean:{" "}
      <button
        type="button"
        onClick={() => onAccept(suggestion)}
        className="text-primary underline hover:text-foreground transition-colors font-medium"
      >
        {suggestion}
      </button>
      ?
    </p>
  );
}
