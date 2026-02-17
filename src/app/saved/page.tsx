"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SavedSearch {
  query: string;
  score: number;
  dateSaved: string;
}

interface WatchStatus {
  query: string;
  lastScore: number;
  lastChecked: string;
  previousScore?: number;
  changed?: "improved" | "worsened" | "same";
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [watchStatuses, setWatchStatuses] = useState<Record<string, WatchStatus>>({});
  const [checking, setChecking] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("brandscout-favorites") || "[]");
      setSaved(data);
    } catch { setSaved([]); }

    try {
      const wl = JSON.parse(localStorage.getItem("brandscout-watchlist") || "[]");
      setWatchlist(new Set(wl));
    } catch { /* ignore */ }

    try {
      const ws = JSON.parse(localStorage.getItem("brandscout-watch-statuses") || "{}");
      setWatchStatuses(ws);
    } catch { /* ignore */ }
  }, []);

  // Re-check watched items on mount
  useEffect(() => {
    if (watchlist.size === 0) return;
    const toCheck = Array.from(watchlist);
    
    const checkItem = async (query: string) => {
      setChecking(prev => new Set(prev).add(query));
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const result = await res.json();
        const newScore = result.score || 0;
        
        setWatchStatuses(prev => {
          const existing = prev[query];
          const updated = {
            ...prev,
            [query]: {
              query,
              lastScore: newScore,
              lastChecked: new Date().toISOString(),
              previousScore: existing?.lastScore,
              changed: existing ? (newScore > existing.lastScore ? "improved" as const : newScore < existing.lastScore ? "worsened" as const : "same" as const) : "same" as const,
            },
          };
          localStorage.setItem("brandscout-watch-statuses", JSON.stringify(updated));
          return updated;
        });

        // Update saved item score too
        setSaved(prev => {
          const updated = prev.map(s => s.query === query ? { ...s, score: newScore } : s);
          localStorage.setItem("brandscout-favorites", JSON.stringify(updated));
          return updated;
        });
      } catch { /* ignore */ }
      setChecking(prev => { const n = new Set(prev); n.delete(query); return n; });
    };

    // Stagger checks
    toCheck.forEach((q, i) => setTimeout(() => checkItem(q), i * 1000));
  }, [watchlist]);

  const remove = (query: string) => {
    const updated = saved.filter(s => s.query !== query);
    setSaved(updated);
    localStorage.setItem("brandscout-favorites", JSON.stringify(updated));
  };

  const toggleWatch = useCallback((query: string) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(query)) next.delete(query);
      else next.add(query);
      localStorage.setItem("brandscout-watchlist", JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Searches</h1>
      <p className="text-muted-foreground mb-8">Your favorited brand name searches. Toggle &quot;Watch&quot; to auto-recheck availability on each visit.</p>

      {saved.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No saved searches yet. Click the heart icon on any result to save it.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {saved.map(s => {
            const ws = watchStatuses[s.query];
            const isWatched = watchlist.has(s.query);
            const isChecking = checking.has(s.query);

            return (
              <Card key={s.query} className="rounded-xl">
                <CardContent className="flex items-center justify-between py-4 px-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <a href={`/?q=${encodeURIComponent(s.query)}`} className="font-semibold text-lg hover:underline">{s.query}</a>
                      {isChecking && <span className="text-xs text-muted-foreground animate-pulse">Checking...</span>}
                      {ws?.changed === "improved" && !isChecking && (
                        <span className="text-xs text-success font-medium" title={`Score went from ${ws.previousScore} to ${ws.lastScore}`}>▲ Improved</span>
                      )}
                      {ws?.changed === "worsened" && !isChecking && (
                        <span className="text-xs text-destructive font-medium" title={`Score went from ${ws.previousScore} to ${ws.lastScore}`}>▼ Worsened</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-medium" style={{ color: s.score >= 70 ? "#16a34a" : s.score >= 40 ? "#ca8a04" : "#dc2626" }}>
                        Score: {s.score}/100
                      </span>
                      <span className="text-xs text-muted-foreground">Saved {new Date(s.dateSaved).toLocaleDateString()}</span>
                      {ws?.lastChecked && (
                        <span className="text-xs text-muted-foreground">Last checked: {new Date(ws.lastChecked).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWatch(s.query)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${isWatched ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-surface"}`}
                      aria-label={isWatched ? "Stop watching" : "Watch for changes"}
                      title={isWatched ? "Stop watching" : "Watch for changes"}
                    >
                      {isWatched ? "👁 Watching" : "Watch"}
                    </button>
                    <a href={`/?q=${encodeURIComponent(s.query)}`}>
                      <Button variant="outline" size="sm" className="rounded-lg">Re-search</Button>
                    </a>
                    <button onClick={() => remove(s.query)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove from saved">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
