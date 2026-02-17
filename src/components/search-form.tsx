"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  onResults: (data: SearchResults) => void;
  onLoading: (loading: boolean) => void;
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

export function SearchForm({ onResults, onLoading }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError("");
    onLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
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
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a business name or domain..."
        className="flex-1 h-12 text-base rounded-xl border-border bg-surface"
      />
      <Button type="submit" className="h-12 px-6 rounded-xl text-base font-medium">
        Scout
      </Button>
      {error && <p className="text-error text-sm mt-2 absolute">{error}</p>}
    </form>
  );
}
