"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem("brandscout-cookies");
    if (!pref) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("brandscout-cookies", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("brandscout-cookies", "declined");
    localStorage.removeItem("brandscout-history");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-card border-t border-border px-4 py-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          We use cookies to improve your experience and store search history locally.
        </p>
        <div className="flex gap-2">
          <button
            onClick={decline}
            className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-surface transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-sm px-3 py-1.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/** Check if user has consented to cookies */
export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("brandscout-cookies") === "accepted";
}
