"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem("brandscout-newsletter") || "[]");
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem("brandscout-newsletter", JSON.stringify(existing));
      }
    } catch { /* ignore */ }
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <div className="bg-surface rounded-xl p-6 text-center">
        <p className="text-success font-medium">🎉 You&apos;re subscribed!</p>
        <p className="text-sm text-muted-foreground mt-1">We&apos;ll send you brand naming tips soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-1">Get brand naming tips in your inbox</h3>
      <p className="text-sm text-muted-foreground mb-4">Join our newsletter for expert branding advice.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm"
        />
        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Subscribe
        </button>
      </form>
      {error && <p className="text-error text-xs mt-2">{error}</p>}
    </div>
  );
}
