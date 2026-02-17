"use client";

import { useState, useEffect, useCallback } from "react";

interface UsageStats {
  totalSearches: number;
  dailySearches: Record<string, number>;
  apiCalls: number;
}

interface BrandSettings {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

function getUsageStats(): UsageStats {
  if (typeof window === "undefined") return { totalSearches: 0, dailySearches: {}, apiCalls: 0 };
  const raw = localStorage.getItem("brandscout-usage");
  if (!raw) return { totalSearches: 0, dailySearches: {}, apiCalls: 0 };
  return JSON.parse(raw);
}

function getBrandSettings(): BrandSettings {
  if (typeof window === "undefined") return { companyName: "", logoUrl: "", primaryColor: "#2563eb", secondaryColor: "#1e40af" };
  const raw = localStorage.getItem("brandscout-brand");
  if (!raw) return { companyName: "", logoUrl: "", primaryColor: "#2563eb", secondaryColor: "#1e40af" };
  return JSON.parse(raw);
}

function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("brandscout-api-key") || "";
}

export default function DashboardPage() {
  const [apiKey, setApiKey] = useState("");
  const [usage, setUsage] = useState<UsageStats>({ totalSearches: 0, dailySearches: {}, apiCalls: 0 });
  const [brand, setBrand] = useState<BrandSettings>({ companyName: "", logoUrl: "", primaryColor: "#2563eb", secondaryColor: "#1e40af" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setApiKey(getApiKey());
    setUsage(getUsageStats());
    setBrand(getBrandSettings());
  }, []);

  const generateKey = useCallback(() => {
    const key = crypto.randomUUID();
    localStorage.setItem("brandscout-api-key", key);
    setApiKey(key);
  }, []);

  const copyKey = useCallback(() => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [apiKey]);

  const saveBrand = useCallback(() => {
    localStorage.setItem("brandscout-brand", JSON.stringify(brand));
  }, [brand]);

  const today = new Date().toISOString().split("T")[0];
  const todaySearches = usage.dailySearches[today] || 0;

  // Last 7 days for chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return { date: key.slice(5), count: usage.dailySearches[key] || 0 };
  });
  const maxCount = Math.max(...last7.map(d => d.count), 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Total Searches</p>
          <p className="text-3xl font-bold mt-1">{usage.totalSearches}</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Searches Today</p>
          <p className="text-3xl font-bold mt-1">{todaySearches}</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">API Calls</p>
          <p className="text-3xl font-bold mt-1">{usage.apiCalls}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-xl border border-border bg-card mb-8">
        <h2 className="text-lg font-semibold mb-4">Last 7 Days</h2>
        <div className="flex items-end gap-2 h-32">
          {last7.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{d.count}</span>
              <div
                className="w-full rounded-t bg-foreground/20 transition-all"
                style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? "4px" : "1px" }}
              />
              <span className="text-xs text-muted-foreground">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div className="p-6 rounded-xl border border-border bg-card mb-8">
        <h2 className="text-lg font-semibold mb-4">API Key</h2>
        {apiKey ? (
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-surface px-3 py-2 rounded text-sm font-mono break-all">{apiKey}</code>
            <button onClick={copyKey} className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-surface transition-colors">
              {copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={generateKey} className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-surface transition-colors">
              Regenerate
            </button>
          </div>
        ) : (
          <button onClick={generateKey} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:opacity-90 transition-opacity">
            Generate API Key
          </button>
        )}
      </div>

      {/* Brand Settings */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4">Report Branding</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Company Name</label>
            <input
              type="text"
              value={brand.companyName}
              onChange={(e) => setBrand({ ...brand, companyName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              placeholder="Your Company"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Logo URL</label>
            <input
              type="url"
              value={brand.logoUrl}
              onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-muted-foreground mb-1">Primary Color</label>
              <input
                type="color"
                value={brand.primaryColor}
                onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                className="w-full h-10 rounded border border-border cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-muted-foreground mb-1">Secondary Color</label>
              <input
                type="color"
                value={brand.secondaryColor}
                onChange={(e) => setBrand({ ...brand, secondaryColor: e.target.value })}
                className="w-full h-10 rounded border border-border cursor-pointer"
              />
            </div>
          </div>
          <button onClick={saveBrand} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:opacity-90 transition-opacity">
            Save Branding
          </button>
        </div>
      </div>
    </div>
  );
}
