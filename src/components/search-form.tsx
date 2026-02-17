"use client";

import { useState, useCallback, useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  onResults: (data: SearchResults) => void;
  onLoading: (loading: boolean) => void;
}

export interface SearchFormHandle {
  searchFor: (q: string) => void;
  focus: () => void;
}

export interface SearchResults {
  id: string;
  query: string;
  name: string;
  type: string;
  score: number;
  domains: { domain: string; tld: string; status: string; source: string }[];
  usernames: { platform: string; username: string; status: string; profileUrl: string; confidence: number }[];
  suggestions: string[];
}

interface HistoryEntry {
  query: string;
  score: number;
  timestamp: number;
}

export const SearchForm = forwardRef<SearchFormHandle, SearchFormProps>(function SearchForm({ onResults, onLoading }, ref) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const loadHistory = useCallback(() => {
    try {
      const h = JSON.parse(localStorage.getItem("brandscout-history") || "[]");
      setHistory(h);
    } catch {
      setHistory([]);
    }
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setError("");
    setShowHistory(false);
    onLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      onResults(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      onLoading(false);
    }
  }, [onResults, onLoading]);

  useImperativeHandle(ref, () => ({
    searchFor: doSearch,
    focus: () => inputRef.current?.focus(),
  }), [doSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleFocus = () => {
    loadHistory();
    setShowHistory(true);
    setHistoryIndex(-1);
  };

  const handleBlur = () => {
    // Delay to allow click on history items
    setTimeout(() => setShowHistory(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowHistory(false);
      inputRef.current?.blur();
      return;
    }

    if (!showHistory || history.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((prev) => Math.min(prev + 1, history.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && historyIndex >= 0) {
      e.preventDefault();
      const selected = history[historyIndex];
      setQuery(selected.query);
      setShowHistory(false);
      doSearch(selected.query);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("brandscout-history");
    setHistory([]);
    setShowHistory(false);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  // Close history on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full max-w-xl" ref={historyRef}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder='Enter a business name or domain... (press "/" to focus)'
            className="h-12 text-base rounded-xl border-border bg-surface pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
        <Button type="submit" className="h-12 px-6 rounded-xl text-base font-medium">
          Scout
        </Button>
      </form>

      {/* Search History Dropdown */}
      {showHistory && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-xs text-muted-foreground font-medium">Recent searches</span>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); clearHistory(); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
          {history.map((h, i) => (
            <button
              key={h.query}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setQuery(h.query); setShowHistory(false); doSearch(h.query); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-surface transition-colors ${i === historyIndex ? "bg-surface" : ""}`}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{h.query}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium" style={{ color: h.score >= 70 ? "#16a34a" : h.score >= 40 ? "#ca8a04" : "#dc2626" }}>
                  {h.score}/100
                </span>
                <span className="text-xs text-muted-foreground">{formatTime(h.timestamp)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-error text-sm mt-2">{error}</p>}
    </div>
  );
});
