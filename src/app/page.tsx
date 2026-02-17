"use client";

import { useState, useRef } from "react";
import { SearchForm, type SearchResults, type SearchFormHandle } from "@/components/search-form";
import { ResultsView } from "@/components/results-view";
import { SeoContent, HomeJsonLd } from "@/components/seo-content";

export default function Home() {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<SearchFormHandle>(null);

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
        <SearchForm ref={searchRef} onResults={setResults} onLoading={setLoading} />
      </div>

      {loading && (
        <div className="mt-16 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Checking availability across platforms...</p>
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
