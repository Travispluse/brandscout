"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  onResults: (data: SearchResults) => void;
  onLoading: (loading: boolean) => void;
}

export interface SearchFormHandle {
  searchFor: (q: string) => void;
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

export const SearchForm = forwardRef<SearchFormHandle, SearchFormProps>(function SearchForm({ onResults, onLoading }, ref) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setError("");
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

  useImperativeHandle(ref, () => ({ searchFor: doSearch }), [doSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <div className="relative flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a business name or domain..."
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
      {error && <p className="text-error text-sm mt-2 absolute">{error}</p>}
    </form>
  );
});
