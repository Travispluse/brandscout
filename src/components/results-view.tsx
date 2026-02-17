"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SearchResults } from "@/components/search-form";
import { exportCSV, exportTXT } from "@/lib/export";

type StatusFilter = "all" | "available" | "taken" | "unknown";
type DomainSort = "default" | "status" | "tld";
type UsernameSort = "default" | "status" | "platform" | "confidence";

function StatusBadge({ status }: { status: string }) {
  if (status === "available") return <Badge className="bg-success text-white hover:bg-success/90">Available</Badge>;
  if (status === "taken") return <Badge variant="destructive">Taken</Badge>;
  return <Badge variant="secondary">Unknown</Badge>;
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#ca8a04" : "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-border" strokeWidth="8" fill="none" />
        <circle
          cx="50" cy="50" r="40"
          stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute text-2xl font-bold">{score}</span>
    </div>
  );
}

function RetryButton({ onRetry }: { onRetry: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    await onRetry();
    setLoading(false);
  };

  return (
    <button
      onClick={handleRetry}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
      title="Retry check"
    >
      {loading ? (
        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
      )}
    </button>
  );
}

function FilterBar({ value, onChange }: { value: StatusFilter; onChange: (v: StatusFilter) => void }) {
  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Taken", value: "taken" },
    { label: "Unknown", value: "unknown" },
  ];

  return (
    <div className="flex gap-1">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
            value === f.value
              ? "bg-foreground text-background"
              : "bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function ShareButtons({ query }: { query: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}?q=${encodeURIComponent(query)}`
    : "";
  const shareText = `I just checked "${query}" on BrandScout — see the results:`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <Button variant="outline" size="sm" onClick={copyLink} className="rounded-lg text-xs">
        {copied ? "Copied!" : "Copy Link"}
      </Button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-surface transition-colors"
      >
        Share on X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-surface transition-colors"
      >
        LinkedIn
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-surface transition-colors"
      >
        Facebook
      </a>
    </div>
  );
}

export function ResultsView({ data, onSearchSuggestion }: { data: SearchResults; onSearchSuggestion?: (name: string) => void }) {
  const [domainFilter, setDomainFilter] = useState<StatusFilter>("all");
  const [usernameFilter, setUsernameFilter] = useState<StatusFilter>("all");
  const [domainSort, setDomainSort] = useState<DomainSort>("default");
  const [usernameSort, setUsernameSort] = useState<UsernameSort>("default");
  const [domains, setDomains] = useState(data.domains);
  const [usernames, setUsernames] = useState(data.usernames);

  const handleExport = (format: "csv" | "txt") => {
    const exportData = {
      query: data.query,
      score: data.score,
      domains: domains.map(d => ({ domain: d.domain, status: d.status })),
      usernames: usernames.map(u => ({ platform: u.platform, username: u.username, status: u.status })),
      suggestions: data.suggestions,
    };

    const content = format === "csv" ? exportCSV(exportData) : exportTXT(exportData);
    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brandscout-${data.name}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const retryDomain = useCallback(async (domain: string) => {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: data.query }),
      });
      const result = await res.json();
      const updated = result.domains?.find((d: { domain: string }) => d.domain === domain);
      if (updated) {
        setDomains((prev) => prev.map((d) => (d.domain === domain ? updated : d)));
      }
    } catch { /* ignore */ }
  }, [data.query]);

  const retryUsername = useCallback(async (platform: string) => {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: data.query }),
      });
      const result = await res.json();
      const updated = result.usernames?.find((u: { platform: string }) => u.platform === platform);
      if (updated) {
        setUsernames((prev) => prev.map((u) => (u.platform === platform ? updated : u)));
      }
    } catch { /* ignore */ }
  }, [data.query]);

  // Filter and sort domains
  const filteredDomains = domains
    .filter((d) => domainFilter === "all" || d.status === domainFilter)
    .sort((a, b) => {
      if (domainSort === "status") {
        const order = { available: 0, taken: 1, unknown: 2 };
        return (order[a.status as keyof typeof order] ?? 2) - (order[b.status as keyof typeof order] ?? 2);
      }
      if (domainSort === "tld") return a.tld.localeCompare(b.tld);
      return 0;
    });

  // Filter and sort usernames
  const filteredUsernames = usernames
    .filter((u) => usernameFilter === "all" || u.status === usernameFilter)
    .sort((a, b) => {
      if (usernameSort === "status") {
        const order = { available: 0, taken: 1, unknown: 2 };
        return (order[a.status as keyof typeof order] ?? 2) - (order[b.status as keyof typeof order] ?? 2);
      }
      if (usernameSort === "platform") return a.platform.localeCompare(b.platform);
      if (usernameSort === "confidence") return b.confidence - a.confidence;
      return 0;
    });

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Score Summary */}
      <Card className="rounded-xl">
        <CardContent className="flex items-center gap-8 p-6">
          <ScoreRing score={data.score} />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{data.query}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Parsed as {data.type}: <span className="font-mono">{data.name}</span>
            </p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")} className="rounded-lg">
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("txt")} className="rounded-lg">
                Export TXT
              </Button>
            </div>
            <ShareButtons query={data.query} />
          </div>
        </CardContent>
      </Card>

      {/* Domain Results */}
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg">Domain Availability</CardTitle>
            <div className="flex items-center gap-3">
              <FilterBar value={domainFilter} onChange={setDomainFilter} />
              <select
                value={domainSort}
                onChange={(e) => setDomainSort(e.target.value as DomainSort)}
                className="text-xs bg-surface border border-border rounded-lg px-2 py-1"
              >
                <option value="default">Default</option>
                <option value="status">By Status</option>
                <option value="tld">By TLD</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {filteredDomains.map((d) => (
              <div key={d.tld} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface">
                <span className="font-mono text-sm">{d.domain}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{d.source}</span>
                  <StatusBadge status={d.status} />
                  {d.status === "unknown" && <RetryButton onRetry={() => retryDomain(d.domain)} />}
                  {d.status === "available" && (
                    <a
                      href={`https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(d.domain)}`}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-primary hover:underline whitespace-nowrap"
                    >
                      Register →
                    </a>
                  )}
                </div>
              </div>
            ))}
            {filteredDomains.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No domains match this filter.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Username Results */}
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg">Username Availability</CardTitle>
            <div className="flex items-center gap-3">
              <FilterBar value={usernameFilter} onChange={setUsernameFilter} />
              <select
                value={usernameSort}
                onChange={(e) => setUsernameSort(e.target.value as UsernameSort)}
                className="text-xs bg-surface border border-border rounded-lg px-2 py-1"
              >
                <option value="default">Default</option>
                <option value="status">By Status</option>
                <option value="platform">By Platform</option>
                <option value="confidence">By Confidence</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {filteredUsernames.map((u) => (
              <div key={u.platform} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface">
                <div>
                  <span className="font-medium text-sm">{u.platform}</span>
                  <span className="text-muted-foreground text-xs ml-2">@{u.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={u.status} />
                  {u.status === "unknown" && <RetryButton onRetry={() => retryUsername(u.platform)} />}
                </div>
              </div>
            ))}
            {filteredUsernames.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No usernames match this filter.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Name Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.suggestions.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className={`text-sm px-3 py-1 rounded-lg font-mono ${onSearchSuggestion ? "cursor-pointer hover:bg-foreground hover:text-background transition-colors" : ""}`}
                  onClick={() => onSearchSuggestion?.(s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center px-4">
        Availability can change quickly. Some platforms restrict automated checks; statuses marked &ldquo;Unknown&rdquo; require manual confirmation.
      </p>
      <p className="text-xs text-muted-foreground/60 text-center px-4">
        Registration links may earn us a small commission at no extra cost to you.
      </p>
    </div>
  );
}
