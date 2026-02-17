"use client";

import { useState, useEffect } from "react";

export function LeadCapturePopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check if permanently dismissed
    if (localStorage.getItem("brandscout-lead-dismissed") === "true") return;
    if (localStorage.getItem("brandscout-lead-captured") === "true") return;

    // Show after 60 seconds OR 3 searches
    const timer = setTimeout(() => setShow(true), 60000);
    
    // Check search count
    try {
      const usage = JSON.parse(localStorage.getItem("brandscout-usage") || "{}");
      if ((usage.totalSearches || 0) >= 3) {
        setShow(true);
      }
    } catch { /* ignore */ }

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const subscribers = JSON.parse(localStorage.getItem("brandscout-newsletter") || "[]");
      subscribers.push({ email: email.trim(), date: new Date().toISOString(), source: "lead-popup" });
      localStorage.setItem("brandscout-newsletter", JSON.stringify(subscribers));
      localStorage.setItem("brandscout-lead-captured", "true");
    } catch { /* ignore */ }
    setSubmitted(true);
    setTimeout(() => setShow(false), 2000);
  };

  const dismiss = () => {
    localStorage.setItem("brandscout-lead-dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-card border border-border rounded-xl shadow-lg p-4 animate-in slide-in-from-bottom-4" role="dialog" aria-label="Newsletter signup">
      {submitted ? (
        <p className="text-sm text-success font-medium">✓ Thanks for subscribing!</p>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold">📬 Get weekly brand naming tips</h3>
            <button onClick={dismiss} className="text-muted-foreground hover:text-foreground text-xs p-1" aria-label="Dismiss permanently">✕</button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Join our newsletter for naming strategies, trends, and tools.</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-background"
              aria-label="Email address"
            />
            <button type="submit" className="px-3 py-1.5 text-sm rounded-lg bg-foreground text-background hover:opacity-90">
              Join
            </button>
          </form>
          <button onClick={dismiss} className="text-xs text-muted-foreground hover:text-foreground mt-2">
            Don&apos;t show again
          </button>
        </>
      )}
    </div>
  );
}
