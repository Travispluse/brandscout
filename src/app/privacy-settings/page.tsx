"use client";

import { useState, useEffect, useCallback } from "react";

export default function PrivacySettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const loadData = useCallback(() => {
    if (typeof window === "undefined") return;
    const all: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("brandscout")) {
        all[key] = localStorage.getItem(key) || "";
      }
    }
    setData(all);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brandscout-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const deleteAll = useCallback(() => {
    Object.keys(data).forEach(key => localStorage.removeItem(key));
    setData({});
    setShowConfirm(false);
  }, [data]);

  const keys = Object.keys(data);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Settings</h1>
      <p className="text-muted-foreground mb-8">View, export, or delete all data BrandScout stores in your browser. No data is stored on our servers.</p>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={exportData}
          disabled={keys.length === 0}
          className="px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Download My Data
        </button>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={keys.length === 0}
            className="px-4 py-2 rounded-lg border border-red-500/50 text-red-500 text-sm hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            Delete My Data
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-500">Are you sure? This cannot be undone.</span>
            <button onClick={deleteAll} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors">
              Yes, Delete Everything
            </button>
            <button onClick={() => setShowConfirm(false)} className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-surface transition-colors">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Data View */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Stored Data ({keys.length} items)</h2>
        {keys.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No BrandScout data found in your browser.</p>
        ) : (
          keys.map(key => {
            let display = data[key];
            try { display = JSON.stringify(JSON.parse(display), null, 2); } catch {}
            return (
              <div key={key} className="p-4 rounded-lg border border-border bg-card">
                <p className="text-sm font-medium mb-1 font-mono">{key}</p>
                <pre className="text-xs text-muted-foreground overflow-x-auto max-h-32 overflow-y-auto whitespace-pre-wrap">{display}</pre>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
