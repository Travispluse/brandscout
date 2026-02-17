"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchForm, type SearchResults, type SearchFormHandle } from "@/components/search-form";
import { hasCookieConsent } from "@/components/cookie-consent";
import { ResultsView } from "@/components/results-view";
import { ResultsSkeleton } from "@/components/ui/skeleton";
import { SeoContent, HomeJsonLd } from "@/components/seo-content";

function HomeContent() {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<SearchFormHandle>(null);
  const searchParams = useSearchParams();

  // Auto-search from URL param
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && searchRef.current) {
      searchRef.current.searchFor(q);
    }
  }, [searchParams]);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleResults = (data: SearchResults) => {
    setResults(data);
    // Save to search history (only if cookies accepted)
    if (hasCookieConsent()) {
      try {
        const history = JSON.parse(localStorage.getItem("brandscout-history") || "[]");
        const entry = { query: data.query, score: data.score, timestamp: Date.now() };
        const filtered = history.filter((h: { query: string }) => h.query !== data.query);
        filtered.unshift(entry);
        localStorage.setItem("brandscout-history", JSON.stringify(filtered.slice(0, 10)));
      } catch { /* ignore */ }
    }

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("q", data.query);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="flex flex-col items-center px-4">
      <HomeJsonLd />
      <div className={`flex flex-col items-center transition-all duration-500 ${results ? "pt-8" : "pt-32"}`}>
        {!results && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Is your brand name available?
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Check domain and social media availability instantly. Free, no signup required.
            </p>
          </div>
        )}
        <SearchForm ref={searchRef} onResults={handleResults} onLoading={setLoading} />
      </div>

      {loading && (
        <div className="mt-8 w-full flex justify-center pb-16">
          <ResultsSkeleton />
        </div>
      )}

      {results && !loading && (
        <div className="mt-8 w-full flex justify-center pb-16">
          <ResultsView data={results} onSearchSuggestion={(name) => searchRef.current?.searchFor(name)} />
        </div>
      )}

      {!results && !loading && <SeoContent />}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
