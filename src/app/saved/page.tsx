"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SavedSearch {
  query: string;
  score: number;
  dateSaved: string;
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedSearch[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("brandscout-favorites") || "[]");
      setSaved(data);
    } catch { setSaved([]); }
  }, []);

  const remove = (query: string) => {
    const updated = saved.filter(s => s.query !== query);
    setSaved(updated);
    localStorage.setItem("brandscout-favorites", JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Searches</h1>
      <p className="text-muted-foreground mb-8">Your favorited brand name searches, stored locally in your browser.</p>

      {saved.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No saved searches yet. Click the heart icon on any result to save it.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {saved.map(s => (
            <Card key={s.query} className="rounded-xl">
              <CardContent className="flex items-center justify-between py-4 px-5">
                <div>
                  <a href={`/?q=${encodeURIComponent(s.query)}`} className="font-semibold text-lg hover:underline">{s.query}</a>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-medium" style={{ color: s.score >= 70 ? "#16a34a" : s.score >= 40 ? "#ca8a04" : "#dc2626" }}>
                      Score: {s.score}/100
                    </span>
                    <span className="text-xs text-muted-foreground">Saved {new Date(s.dateSaved).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/?q=${encodeURIComponent(s.query)}`}>
                    <Button variant="outline" size="sm" className="rounded-lg">Re-search</Button>
                  </a>
                  <button onClick={() => remove(s.query)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
