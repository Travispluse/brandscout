"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateStats } from "@/lib/achievements";
import { expandPattern, expandWildcard, parseMultiKeyword } from "@/lib/advanced-search";

interface BulkResult {
  name: string;
  score: number;
  comStatus: string;
  netStatus: string;
  platforms: { platform: string; status: string }[];
  error?: string;
}

function StatusDot({ status }: { status: string }) {
  const color = status === "available" ? "bg-success" : status === "taken" ? "bg-destructive" : "bg-muted-foreground";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} title={status} />;
}

function AdvancedSearch({ onProcess, disabled }: { onProcess: (names: string[]) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [pattern, setPattern] = useState("");
  const [mode, setMode] = useState<"wildcard" | "pattern" | "keyword">("wildcard");
  const [preview, setPreview] = useState<string[]>([]);

  const handlePreview = () => {
    let names: string[] = [];
    if (mode === "wildcard") names = expandWildcard(pattern);
    else if (mode === "pattern") names = expandPattern(pattern);
    else names = parseMultiKeyword(pattern);
    setPreview(names.slice(0, 20));
  };

  return (
    <Card className="rounded-xl mb-8">
      <CardHeader>
        <button onClick={() => setOpen(!open)} className="text-left w-full">
          <CardTitle className="text-lg flex items-center gap-2">
            🔬 Advanced Search {open ? "▾" : "▸"}
          </CardTitle>
        </button>
      </CardHeader>
      {open && (
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(["wildcard", "pattern", "keyword"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`text-xs px-3 py-1.5 rounded-lg ${mode === m ? "bg-foreground text-background" : "bg-surface text-muted-foreground"}`}>
                {m === "wildcard" ? "Wildcard (*)" : m === "pattern" ? "Pattern (??)" : "AND/OR"}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {mode === "wildcard" && 'Use * for any characters: "my*app" → myapp, mycoolapp, mybestapp...'}
            {mode === "pattern" && 'Use ? for single characters: "??tech" → aatech, abtech...'}
            {mode === "keyword" && 'Use AND/OR/+: "tech AND hub", "cool OR awesome + brand"'}
          </p>
          <div className="flex gap-2">
            <input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder={mode === "wildcard" ? "my*app" : mode === "pattern" ? "??tech" : "cool OR awesome + brand"}
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-surface border border-border"
            />
            <Button size="sm" onClick={handlePreview} className="rounded-lg">Preview</Button>
          </div>
          {preview.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {preview.map(n => <Badge key={n} variant="secondary" className="font-mono text-xs">{n}</Badge>)}
              </div>
              <Button size="sm" onClick={() => onProcess(preview)} disabled={disabled} className="rounded-lg">
                Check All ({preview.length})
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function BulkPage() {
  const [results, setResults] = useState<BulkResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const processNames = async (names: string[]) => {
    const limited = names.slice(0, 25);
    setProcessing(true);
    setProgress({ current: 0, total: limited.length });
    setResults([]);
    const allResults: BulkResult[] = [];

    for (let i = 0; i < limited.length; i++) {
      const name = limited[i];
      setProgress({ current: i + 1, total: limited.length });
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: name }),
        });
        const data = await res.json();
        if (!res.ok) {
          allResults.push({ name, score: 0, comStatus: "unknown", netStatus: "unknown", platforms: [], error: data.error });
        } else {
          const comDomain = data.domains?.find((d: { tld: string }) => d.tld === ".com");
          const netDomain = data.domains?.find((d: { tld: string }) => d.tld === ".net");
          allResults.push({
            name,
            score: data.score,
            comStatus: comDomain?.status || "unknown",
            netStatus: netDomain?.status || "unknown",
            platforms: (data.usernames || []).slice(0, 5).map((u: { platform: string; status: string }) => ({ platform: u.platform, status: u.status })),
          });
        }
      } catch {
        allResults.push({ name, score: 0, comStatus: "unknown", netStatus: "unknown", platforms: [], error: "Network error" });
      }
      setResults([...allResults]);
    }
    setProcessing(false);
    try { updateStats({ usedBulk: true }); } catch { /* ignore */ }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const names = text.split(/[\n,]/).map(n => n.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      if (names.length > 25) {
        alert(`Only the first 25 names will be processed (you uploaded ${names.length}). Upgrade for more!`);
      }
      processNames(names);
    };
    reader.readAsText(file);
  };

  const exportResults = () => {
    const lines = ["Name,Score,.com,.net," + (results[0]?.platforms.map(p => p.platform).join(",") || "")];
    for (const r of results) {
      lines.push(`${r.name},${r.score},${r.comStatus},${r.netStatus},${r.platforms.map(p => p.status).join(",")}`);
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brandscout-bulk-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Bulk Check</h1>
      <p className="text-muted-foreground mb-8">Upload a CSV with brand names (one per row, max 25) and check them all at once.</p>

      <AdvancedSearch onProcess={processNames} disabled={processing} />

      <Card className="rounded-xl mb-8">
        <CardContent className="py-8 flex flex-col items-center gap-4">
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          <Button onClick={() => fileRef.current?.click()} disabled={processing} className="rounded-xl">
            {processing ? `Processing ${progress.current}/${progress.total}...` : "Upload CSV"}
          </Button>
          <p className="text-xs text-muted-foreground">One brand name per row. Max 25 names per upload.</p>
          {processing && (
            <div className="w-full max-w-xs bg-surface rounded-full h-2 overflow-hidden">
              <div className="bg-foreground h-full transition-all duration-300 rounded-full" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Results ({results.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={exportResults} className="rounded-lg">Export CSV</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Score</th>
                    <th className="py-2 pr-4 font-medium">.com</th>
                    <th className="py-2 pr-4 font-medium">.net</th>
                    {results[0]?.platforms.map(p => (
                      <th key={p.platform} className="py-2 pr-4 font-medium">{p.platform}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.name} className="border-b border-border/50">
                      <td className="py-2 pr-4">
                        <a href={`/?q=${encodeURIComponent(r.name)}`} className="font-mono hover:underline">{r.name}</a>
                      </td>
                      <td className="py-2 pr-4">
                        <span style={{ color: r.score >= 70 ? "#16a34a" : r.score >= 40 ? "#ca8a04" : "#dc2626" }}>{r.score}</span>
                      </td>
                      <td className="py-2 pr-4"><StatusDot status={r.comStatus} /></td>
                      <td className="py-2 pr-4"><StatusDot status={r.netStatus} /></td>
                      {r.platforms.map(p => (
                        <td key={p.platform} className="py-2 pr-4"><StatusDot status={p.status} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
