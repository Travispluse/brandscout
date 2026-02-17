"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateStats } from "@/lib/achievements";

interface CompareResult {
  name: string;
  score: number;
  comStatus: string;
  netStatus: string;
  availableDomains: number;
  totalDomains: number;
  availableUsernames: number;
  totalUsernames: number;
  loading?: boolean;
  error?: string;
}

function ScoreBar({ score, isWinner }: { score: number; isWinner: boolean }) {
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#ca8a04" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-surface rounded-full h-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-lg font-bold" style={{ color }}>{score}</span>
      {isWinner && <Badge className="bg-success text-white text-xs">Winner</Badge>}
    </div>
  );
}

export default function ComparePage() {
  const [inputs, setInputs] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<CompareResult[]>([]);
  const [loading, setLoading] = useState(false);

  const updateInput = (i: number, v: string) => {
    const next = [...inputs];
    next[i] = v;
    setInputs(next);
  };

  const addInput = () => {
    if (inputs.length < 5) setInputs([...inputs, ""]);
  };

  const removeInput = (i: number) => {
    if (inputs.length > 2) setInputs(inputs.filter((_, idx) => idx !== i));
  };

  const runCompare = async () => {
    const names = inputs.map(n => n.trim()).filter(Boolean);
    if (names.length < 2) return;
    setLoading(true);
    setResults(names.map(n => ({ name: n, score: 0, comStatus: "unknown", netStatus: "unknown", availableDomains: 0, totalDomains: 0, availableUsernames: 0, totalUsernames: 0, loading: true })));

    const allResults: CompareResult[] = await Promise.all(
      names.map(async (name) => {
        try {
          const res = await fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: name }),
          });
          const data = await res.json();
          if (!res.ok) return { name, score: 0, comStatus: "unknown", netStatus: "unknown", availableDomains: 0, totalDomains: 0, availableUsernames: 0, totalUsernames: 0, error: data.error };
          const comDomain = data.domains?.find((d: { tld: string }) => d.tld === ".com");
          const netDomain = data.domains?.find((d: { tld: string }) => d.tld === ".net");
          return {
            name,
            score: data.score,
            comStatus: comDomain?.status || "unknown",
            netStatus: netDomain?.status || "unknown",
            availableDomains: data.domains?.filter((d: { status: string }) => d.status === "available").length || 0,
            totalDomains: data.domains?.length || 0,
            availableUsernames: data.usernames?.filter((u: { status: string }) => u.status === "available").length || 0,
            totalUsernames: data.usernames?.length || 0,
          };
        } catch {
          return { name, score: 0, comStatus: "unknown", netStatus: "unknown", availableDomains: 0, totalDomains: 0, availableUsernames: 0, totalUsernames: 0, error: "Network error" };
        }
      })
    );

    setResults(allResults);
    setLoading(false);
    try { updateStats({ usedCompare: true }); } catch { /* ignore */ }
  };

  const maxScore = Math.max(...results.map(r => r.score), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">A/B Name Tester</h1>
      <p className="text-muted-foreground mb-8">Compare 2–5 brand names side by side to find the best one.</p>

      <Card className="rounded-xl mb-8">
        <CardContent className="py-6 space-y-3">
          {inputs.map((val, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={val}
                onChange={(e) => updateInput(i, e.target.value)}
                placeholder={`Brand name ${i + 1}`}
                className="rounded-xl"
              />
              {inputs.length > 2 && (
                <button onClick={() => removeInput(i)} className="text-muted-foreground hover:text-foreground px-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          ))}
          <div className="flex gap-2">
            {inputs.length < 5 && (
              <Button variant="outline" onClick={addInput} className="rounded-xl text-sm">+ Add Name</Button>
            )}
            <Button onClick={runCompare} disabled={loading || inputs.filter(i => i.trim()).length < 2} className="rounded-xl">
              {loading ? "Comparing..." : "Compare"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && !loading && (
        <div className="space-y-4">
          {results.map(r => (
            <Card key={r.name} className={`rounded-xl ${r.score === maxScore && maxScore > 0 ? "ring-2 ring-success" : ""}`}>
              <CardContent className="py-5 px-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">{r.name}</h3>
                  {r.error && <Badge variant="destructive">{r.error}</Badge>}
                </div>
                <ScoreBar score={r.score} isWinner={r.score === maxScore && maxScore > 0} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">.com</span>
                    <p className={`font-medium ${r.comStatus === "available" ? "text-success" : r.comStatus === "taken" ? "text-destructive" : "text-muted-foreground"}`}>
                      {r.comStatus}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">.net</span>
                    <p className={`font-medium ${r.netStatus === "available" ? "text-success" : r.netStatus === "taken" ? "text-destructive" : "text-muted-foreground"}`}>
                      {r.netStatus}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Domains</span>
                    <p className="font-medium">{r.availableDomains}/{r.totalDomains} available</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usernames</span>
                    <p className="font-medium">{r.availableUsernames}/{r.totalUsernames} available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
