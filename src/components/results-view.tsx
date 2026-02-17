"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SearchResults } from "@/components/search-form";
import { exportCSV, exportTXT } from "@/lib/export";

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
        <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
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

export function ResultsView({ data, onSearchSuggestion }: { data: SearchResults; onSearchSuggestion?: (name: string) => void }) {
  const handleExport = (format: "csv" | "txt") => {
    const exportData = {
      query: data.query,
      score: data.score,
      domains: data.domains.map(d => ({ domain: d.domain, status: d.status })),
      usernames: data.usernames.map(u => ({ platform: u.platform, username: u.username, status: u.status })),
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

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Score Summary */}
      <Card className="rounded-xl">
        <CardContent className="flex items-center gap-8 p-6">
          <ScoreRing score={data.score} />
          <div>
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
          </div>
        </CardContent>
      </Card>

      {/* Domain Results */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Domain Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {data.domains.map((d) => (
              <div key={d.tld} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface">
                <span className="font-mono text-sm">{d.domain}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{d.source}</span>
                  <StatusBadge status={d.status} />
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
          </div>
        </CardContent>
      </Card>

      {/* Username Results */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Username Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {data.usernames.map((u) => (
              <div key={u.platform} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface">
                <div>
                  <span className="font-medium text-sm">{u.platform}</span>
                  <span className="text-muted-foreground text-xs ml-2">@{u.username}</span>
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
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
