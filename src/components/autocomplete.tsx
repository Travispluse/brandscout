"use client";

import { useState, useEffect, useRef } from "react";

const SUFFIXES = ["hq", "app", "co", "io", "lab", "hub", "dev", "pro", "studio", "digital"];

interface AutocompleteProps {
  query: string;
  onSelect: (value: string) => void;
  visible: boolean;
}

export function Autocomplete({ query, onSelect, visible }: AutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (!visible || query.length < 3) {
      setSuggestions([]);
      return;
    }

    timerRef.current = setTimeout(() => {
      const base = query.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (base.length < 3) { setSuggestions([]); return; }
      const results = SUFFIXES
        .map(s => base + s)
        .filter(s => s !== base && s.length <= 30);
      setSuggestions(results);
      setSelectedIndex(-1);
    }, 300);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, visible]);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-40 overflow-hidden">
      <div className="px-3 py-1.5 border-b border-border">
        <span className="text-xs text-muted-foreground font-medium">Suggestions</span>
      </div>
      {suggestions.map((s, i) => (
        <button
          key={s}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); onSelect(s); }}
          onMouseEnter={() => setSelectedIndex(i)}
          className={`w-full text-left px-3 py-2 text-sm font-mono hover:bg-surface transition-colors ${
            i === selectedIndex ? "bg-surface" : ""
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

/** Get keyboard navigation index for autocomplete */
export function useAutocompleteKeyboard(
  suggestions: string[],
  onSelect: (value: string) => void
) {
  const [index, setIndex] = useState(-1);

  const handleKey = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && index >= 0) {
      e.preventDefault();
      onSelect(suggestions[index]);
      setIndex(-1);
    }
  };

  return { index, handleKey, setIndex };
}
