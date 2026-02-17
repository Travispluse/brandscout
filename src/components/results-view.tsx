"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SearchResults } from "@/components/search-form";
import { exportCSV, exportTXT } from "@/lib/export";
import { InfoTooltip } from "@/components/tooltip";
import { generateStoryImage } from "@/lib/story-export";
import { exportPPT } from "@/lib/ppt-export";
import { createShareLink } from "@/lib/share-link";
import { analyzeMarket } from "@/lib/market-analysis";
import { trackSearch } from "@/lib/achievements";
import {
  analyzePronunciation,
  analyzeNameStrength,
  analyzeSentiment,
  analyzeTrademarkRisk,
  getScoreBreakdown,
} from "@/lib/name-analysis";

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
    <div className="flex gap-1 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors min-h-[44px] sm:min-h-0 ${
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

function FavoriteButton({ data }: { data: SearchResults }) {
  const [isFav, setIsFav] = useState(false);

  useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("brandscout-favorites") || "[]");
      setIsFav(favs.some((f: { query: string }) => f.query === data.query));
    } catch { /* ignore */ }
  });

  const toggle = () => {
    try {
      const favs = JSON.parse(localStorage.getItem("brandscout-favorites") || "[]");
      if (isFav) {
        const updated = favs.filter((f: { query: string }) => f.query !== data.query);
        localStorage.setItem("brandscout-favorites", JSON.stringify(updated));
        setIsFav(false);
      } else {
        favs.unshift({ query: data.query, score: data.score, dateSaved: new Date().toISOString() });
        localStorage.setItem("brandscout-favorites", JSON.stringify(favs));
        setIsFav(true);
      }
    } catch { /* ignore */ }
  };

  return (
    <button onClick={toggle} className="p-2 rounded-lg hover:bg-surface transition-colors" aria-label={isFav ? "Remove from favorites" : "Save to favorites"} title={isFav ? "Remove from favorites" : "Save to favorites"}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "#dc2626" : "none"} stroke={isFav ? "#dc2626" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
    </button>
  );
}

function ReadabilityBadge({ name }: { name: string }) {
  const vowels = (name.match(/[aeiou]/gi) || []).length;
  const consonants = (name.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
  const ratio = vowels / (name.length || 1);
  // Count syllables (rough)
  const syllables = name.replace(/[^a-zA-Z]/g, "").replace(/e$/i, "").match(/[aeiou]+/gi)?.length || 1;
  // Check for consonant clusters (hard to pronounce)
  const clusters = (name.match(/[bcdfghjklmnpqrstvwxyz]{3,}/gi) || []).length;

  let label = "Easy to say";
  let color = "bg-success text-white";
  if (clusters > 1 || syllables > 4 || ratio < 0.15) {
    label = "Complex";
    color = "bg-destructive text-white";
  } else if (clusters > 0 || syllables > 3 || ratio < 0.25 || ratio > 0.65) {
    label = "Moderate";
    color = "bg-yellow-500 text-white";
  }

  return <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>;
}

function LengthBadge({ name }: { name: string }) {
  const len = name.length;
  let label: string;
  let color: string;
  if (len <= 4) { label = `Short (${len})`; color = "text-yellow-500"; }
  else if (len <= 10) { label = `Perfect (${len})`; color = "text-success"; }
  else if (len <= 14) { label = `Good (${len})`; color = "text-foreground"; }
  else { label = `Long (${len})`; color = "text-destructive"; }

  return <span className={`text-xs font-medium ${color}`}>{label}</span>;
}

function DownloadCardButton({ data }: { data: SearchResults }) {
  const generate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, 800, 420);

    // Brand name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Inter, sans-serif";
    ctx.fillText(data.query, 40, 80);

    // Score circle
    const cx = 700, cy = 70, r = 40;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (data.score / 100) * Math.PI * 2);
    ctx.strokeStyle = data.score >= 70 ? "#16a34a" : data.score >= 40 ? "#ca8a04" : "#dc2626";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${data.score}`, cx, cy + 8);
    ctx.textAlign = "left";

    // Domains
    ctx.fillStyle = "#9ca3af";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("DOMAINS", 40, 140);
    let y = 165;
    for (const d of data.domains.slice(0, 6)) {
      ctx.fillStyle = d.status === "available" ? "#16a34a" : d.status === "taken" ? "#dc2626" : "#6b7280";
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText(`${d.status === "available" ? "✓" : d.status === "taken" ? "✗" : "?"} ${d.domain}`, 40, y);
      y += 22;
    }

    // Usernames
    ctx.fillStyle = "#9ca3af";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("USERNAMES", 400, 140);
    y = 165;
    for (const u of data.usernames.slice(0, 6)) {
      ctx.fillStyle = u.status === "available" ? "#16a34a" : u.status === "taken" ? "#dc2626" : "#6b7280";
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText(`${u.status === "available" ? "✓" : u.status === "taken" ? "✗" : "?"} ${u.platform}`, 400, y);
      y += 22;
    }

    // Branding
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("BrandScout.net — Free Brand Name Checker", 40, 400);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `brandscout-${data.name}.png`;
    a.click();
  };

  return (
    <Button variant="outline" size="sm" onClick={generate} className="rounded-lg">
      Download as Image
    </Button>
  );
}

function PrintPDFButton({ data }: { data: SearchResults }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-lg" data-print-hide>
      Export PDF
    </Button>
  );
}

// ====== Score Breakdown (Feature 92) ======
function ScoreBreakdownSection({ data }: { data: SearchResults }) {
  const [open, setOpen] = useState(false);
  const breakdown = getScoreBreakdown(data.domains, data.usernames, data.name);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-primary hover:underline flex items-center gap-1"
        aria-expanded={open}
        aria-controls="score-breakdown"
      >
        {open ? "▾" : "▸"} Score Breakdown
      </button>
      {open && (
        <div id="score-breakdown" className="mt-3 space-y-2 text-sm bg-surface rounded-lg p-4">
          <p>{breakdown.domainAvailable} of {breakdown.domainTotal} domains available ({breakdown.domainPercent}%)</p>
          <p>{breakdown.platformAvailable} of {breakdown.platformTotal} platforms available ({breakdown.platformPercent}%)</p>
          <p>Name readability: <span className="font-medium">{breakdown.readabilityRating}</span></p>
          <p>Name length: {breakdown.lengthChars} chars — <span className="font-medium">{breakdown.lengthRating}</span></p>
          {breakdown.tips.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="font-medium text-xs text-muted-foreground mb-1">💡 Tips</p>
              {breakdown.tips.map((tip, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {tip}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ====== Name Strength Badge (Feature 94) ======
function NameStrengthBadge({ name }: { name: string }) {
  const [showDetails, setShowDetails] = useState(false);
  const analysis = analyzeNameStrength(name);
  const color = analysis.badge === "Strong Name" ? "bg-success text-white" : analysis.badge === "Good Name" ? "bg-yellow-500 text-white" : "bg-destructive text-white";

  return (
    <span className="relative inline-flex">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer ${color}`}
        aria-label={`Name strength: ${analysis.badge}`}
      >
        {analysis.badge}
      </button>
      {showDetails && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg p-3 shadow-lg z-10 w-56">
          {analysis.reasons.map((r, i) => (
            <p key={i} className="text-xs text-muted-foreground">• {r}</p>
          ))}
        </div>
      )}
    </span>
  );
}

// ====== Pronunciation Badge (Feature 152) ======
function PronunciationBadge({ name }: { name: string }) {
  const [showDetails, setShowDetails] = useState(false);
  const analysis = analyzePronunciation(name);
  const color = analysis.rating === "Easy to pronounce" ? "bg-success text-white" : analysis.rating === "Moderate" ? "bg-yellow-500 text-white" : "bg-destructive text-white";

  return (
    <span className="relative inline-flex">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer ${color}`}
        aria-label={`Pronunciation: ${analysis.rating}`}
      >
        🗣 {analysis.rating}
      </button>
      {showDetails && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg p-3 shadow-lg z-10 w-56">
          {analysis.details.map((d, i) => (
            <p key={i} className="text-xs text-muted-foreground">• {d}</p>
          ))}
        </div>
      )}
    </span>
  );
}

// ====== Sentiment Badge (Feature 151) ======
function SentimentBadge({ name }: { name: string }) {
  const analysis = analyzeSentiment(name);
  const color = analysis.rating === "Positive associations" ? "text-success" : analysis.rating === "Neutral" ? "text-muted-foreground" : "text-destructive";

  return (
    <span className={`text-xs font-medium ${color}`} title={analysis.details[0]}>
      {analysis.rating}
    </span>
  );
}

// ====== Trademark Risk (Feature 153) ======
function TrademarkRiskSection({ name }: { name: string }) {
  const analysis = analyzeTrademarkRisk(name);
  const color = analysis.level === "Low" ? "text-success" : analysis.level === "Medium" ? "text-yellow-500" : "text-destructive";

  return (
    <div className="p-4 rounded-lg bg-surface">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium">⚖️ Trademark Risk: <span className={color}>{analysis.level}</span></span>
      </div>
      {analysis.warnings.map((w, i) => (
        <p key={i} className="text-xs text-muted-foreground">• {w}</p>
      ))}
      <a
        href={analysis.searchUrl}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
        aria-label="Search USPTO trademark database"
      >
        Search USPTO Database →
      </a>
    </div>
  );
}

// ====== LinkedIn Snippet Generator (Feature 178) ======
function LinkedInSnippetButton({ data }: { data: SearchResults }) {
  const [copied, setCopied] = useState(false);

  const generateSnippet = () => {
    const domainAvail = data.domains.find(d => d.tld === ".com");
    const domainStatus = domainAvail ? (domainAvail.status === "available" ? "available ✅" : "taken ❌") : "unknown";
    const socialAvail = data.usernames.filter(u => u.status === "available").length;
    const socialTotal = data.usernames.length;

    const snippet = `I just checked the availability of "${data.query}" using BrandScout 🔍

Domain: ${data.name}.com is ${domainStatus}
Social handles: ${socialAvail}/${socialTotal} available
Score: ${data.score}/100

Check your brand name at brandscout.net`;

    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={generateSnippet} className="rounded-lg text-xs" aria-label="Generate LinkedIn post and copy to clipboard">
      {copied ? "Copied!" : "📋 LinkedIn Post"}
    </Button>
  );
}

// ====== Share Link Button ======
function ShareLinkButton({ data }: { data: SearchResults }) {
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    const link = createShareLink(data);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="rounded-lg">
      {copied ? "Link Copied!" : "🔗 Share Link"}
    </Button>
  );
}

// ====== Competitor Brand Heatmap (Feature 167) ======
function AvailabilityHeatmap({ domains, usernames }: { domains: { domain: string; status: string }[]; usernames: { platform: string; status: string }[] }) {
  const items = [
    ...domains.map(d => ({ label: d.domain, status: d.status })),
    ...usernames.map(u => ({ label: u.platform, status: u.status })),
  ];
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg">Availability Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {items.map((item, i) => (
            <div
              key={i}
              className={`px-2 py-1 rounded text-xs font-medium ${
                item.status === "available" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                item.status === "taken" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}
              title={`${item.label}: ${item.status}`}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/40 inline-block" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/40 inline-block" /> Taken</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-500/40 inline-block" /> Unknown</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ====== Market Analysis (Features 168-169) ======
function MarketAnalysisCard({ domains, usernames }: { domains: { status: string }[]; usernames: { status: string }[] }) {
  const analysis = analyzeMarket(domains, usernames);
  const color = analysis.marketOpportunity === "High" ? "text-green-400" : analysis.marketOpportunity === "Medium" ? "text-yellow-400" : "text-red-400";
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg">Market Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Niche Demand:</span>
          <span className="text-sm">{analysis.nicheDemand}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Market Opportunity:</span>
          <span className={`text-sm font-bold ${color}`}>{analysis.marketOpportunity}</span>
        </div>
        <p className="text-xs text-muted-foreground">{analysis.explanation}</p>
      </CardContent>
    </Card>
  );
}

// ====== Registrar Dropdown (Feature 180) ======
function RegistrarLinks({ domain }: { domain: string }) {
  const [open, setOpen] = useState(false);
  const registrars = [
    { name: "Namecheap", url: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}` },
    { name: "GoDaddy", url: `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domain)}` },
    { name: "Porkbun", url: `https://porkbun.com/checkout/search?q=${encodeURIComponent(domain)}` },
    { name: "Cloudflare", url: `https://www.cloudflare.com/products/registrar/` },
    { name: "Google/Squarespace", url: `https://domains.squarespace.com/` },
  ];
  return (
    <span className="relative">
      <button onClick={() => setOpen(!open)} className="text-xs text-primary hover:underline whitespace-nowrap">
        Register ▾
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-20 w-40">
          {registrars.map(r => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener" className="block px-3 py-2 text-xs hover:bg-surface transition-colors">
              {r.name}
            </a>
          ))}
          <a href="/registrars" className="block px-3 py-2 text-xs text-primary hover:bg-surface border-t border-border">
            Compare all →
          </a>
        </div>
      )}
    </span>
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
        <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 p-4 sm:p-6">
          <div className="relative shrink-0">
            <ScoreRing score={data.score} />
            <span className="absolute -top-1 -right-1"><InfoTooltip text="Score is based on 40% platform availability, 30% domain quality, 20% readability, 10% length" /></span>
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-semibold break-all">{data.query}</h2>
              <FavoriteButton data={data} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              <p className="text-muted-foreground text-sm break-all">
                Parsed as {data.type}: <span className="font-mono">{data.name}</span>
              </p>
              <ReadabilityBadge name={data.name} />
              <LengthBadge name={data.name} />
              <NameStrengthBadge name={data.name} />
              <PronunciationBadge name={data.name} />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <SentimentBadge name={data.name} />
            </div>
            <ScoreBreakdownSection data={data} />
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")} className="rounded-lg text-xs sm:text-sm min-h-[44px] min-w-[44px]">
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("txt")} className="rounded-lg text-xs sm:text-sm min-h-[44px] min-w-[44px]">
                Export TXT
              </Button>
              <PrintPDFButton data={data} />
              <DownloadCardButton data={data} />
              <LinkedInSnippetButton data={data} />
              <Button variant="outline" size="sm" onClick={() => {
                const avail = data.domains.filter(d => d.status === "available").length + data.usernames.filter(u => u.status === "available").length;
                const taken = data.domains.filter(d => d.status === "taken").length + data.usernames.filter(u => u.status === "taken").length;
                generateStoryImage({ brandName: data.query, score: data.score, availableCount: avail, takenCount: taken });
              }} className="rounded-lg text-xs sm:text-sm min-h-[44px]">
                📱 Create Story
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportPPT(data)} className="rounded-lg text-xs sm:text-sm min-h-[44px]">
                📊 Export PPT
              </Button>
              <ShareLinkButton data={data} />
            </div>
            <ShareButtons query={data.query} />
          </div>
        </CardContent>
      </Card>

      {/* Domain Results */}
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg">Domain Availability<InfoTooltip text="Checked via RDAP and DNS lookup" /></CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
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
              <div key={d.tld} className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 rounded-lg bg-surface">
                <span className="font-mono text-sm break-all">{d.domain}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground hidden sm:inline">{d.source}</span>
                  <StatusBadge status={d.status} />
                  {d.status === "unknown" && <RetryButton onRetry={() => retryDomain(d.domain)} />}
                  {d.status === "available" && (
                    <RegistrarLinks domain={d.domain} />
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
            <CardTitle className="text-lg">Username Availability<InfoTooltip text="Checked via HTTP profile detection. Unknown means the platform blocked our check." /></CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
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
              <div key={u.platform} className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 rounded-lg bg-surface">
                <div className="min-w-0">
                  <span className="font-medium text-sm">{u.platform}</span>
                  <span className="text-muted-foreground text-xs ml-2 break-all">@{u.username}</span>
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

      {/* Availability Heatmap */}
      <AvailabilityHeatmap domains={domains} usernames={usernames} />

      {/* Market Analysis */}
      <MarketAnalysisCard domains={domains} usernames={usernames} />

      {/* Trademark Risk */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Trademark Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <TrademarkRiskSection name={data.name} />
        </CardContent>
      </Card>

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
