"use client";

// Analytics consent for BrandScout.
//
// Google Analytics, Microsoft Clarity (session replay) and Ahrefs Analytics are
// third parties, so none of their scripts load and nothing is sent to them until
// the visitor taps "Allow". "Decline", the Global Privacy Control signal, or no
// answer yet all mean they never load. Search history in localStorage is a
// first-party convenience and keeps its existing opt-in (same "Allow" choice).
// Keep /privacy (src/app/privacy/page.tsx) in step with this file.
//
// Consent is versioned. The pre-November-2026 banner ("brandscout-cookies") only
// asked about cookies for search history and never mentioned analytics, so a
// legacy "accepted" value is NOT analytics consent: it still enables local search
// history, but those visitors see the new banner and no tracker loads until they
// tap "Allow" on it. Only CONSENT_KEY below can turn analytics on.

import { useEffect, useState } from "react";

const CONSENT_KEY = "brandscout-consent-v2"; // {"analytics": true|false, "ts": ISO date}
const LEGACY_KEY = "brandscout-cookies"; // old banner: search history only
const GA_MEASUREMENT_ID = "G-G2EKY15D8R";
const CLARITY_PROJECT_ID = "vivwtse9is";
const AHREFS_KEY = "Em0aeVaZxe5tcWGBrzZTlw";

type Consent = "accepted" | "declined" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
    __brandscoutTrackersLoaded?: boolean;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

function gpcEnabled(): boolean {
  try {
    return typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
  } catch {
    return false;
  }
}

// The visitor's answer on the current banner, ignoring GPC. null = not asked yet.
function storedChoice(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { analytics?: unknown };
    if (parsed && parsed.analytics === true) return "accepted";
    if (parsed && parsed.analytics === false) return "declined";
  } catch {
    /* Storage blocked or malformed: treat as no answer yet. */
  }
  return null;
}

// Analytics consent: GPC always wins; legacy values never count.
function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  if (gpcEnabled()) return "declined";
  return storedChoice();
}

function saveConsent(value: "accepted" | "declined") {
  try {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ analytics: value === "accepted", ts: new Date().toISOString() })
    );
  } catch {
    /* Private browsing: the choice lasts for this page view. */
  }
}

function addScript(src: string, attrs: Record<string, string> = {}) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
  document.head.appendChild(script);
}

// Google's documented opt-out switch: while it is set, a loaded Google tag sends nothing.
function applyGaSwitch() {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = readConsent() !== "accepted";
}

function loadTrackers() {
  applyGaSwitch();
  if (readConsent() !== "accepted" || window.__brandscoutTrackersLoaded) return;
  window.__brandscoutTrackersLoaded = true;

  // Google Analytics: analytics only, no advertising storage or signals.
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);

  // Microsoft Clarity (session replay / heatmaps).
  const clarityQueue: ((...args: unknown[]) => void) & { q?: unknown[] } = function clarity() {
    // eslint-disable-next-line prefer-rest-params
    (clarityQueue.q = clarityQueue.q || []).push(arguments);
  };
  window.clarity = window.clarity || clarityQueue;
  addScript(`https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}?ref=bwt`);

  // Ahrefs Web Analytics.
  addScript("https://analytics.ahrefs.com/analytics.js", { "data-key": AHREFS_KEY });
}

/**
 * Whether recent searches may be kept in this browser (first-party only).
 * A choice on the current banner decides; otherwise an "accepted" answer on the
 * old banner, which asked about exactly this, still counts.
 */
export function hasCookieConsent(): boolean {
  const choice = storedChoice();
  if (choice !== null) return choice === "accepted";
  try {
    return window.localStorage.getItem(LEGACY_KEY) === "accepted";
  } catch {
    return false;
  }
}

/** "Change cookie choices" link for the footer and privacy page. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      data-consent-reset=""
      className={className ?? "underline hover:text-gray-900 transition-colors"}
      onClick={() => window.dispatchEvent(new Event("brandscout-consent-reset"))}
    >
      Change cookie choices
    </button>
  );
}

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Deferred so the banner renders after hydration (no server/client mismatch).
    const initial = window.setTimeout(() => setShow(readConsent() === null), 0);
    loadTrackers();

    const onReset = () => {
      try {
        window.localStorage.removeItem(CONSENT_KEY);
        window.localStorage.removeItem(LEGACY_KEY);
      } catch {
        /* ignore */
      }
      applyGaSwitch();
      // Scripts that already loaded stay in memory until the next page load;
      // the GA switch stops GA sending immediately.
      setShow(readConsent() === null);
    };
    // A choice made in one tab applies to every open tab of the site.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return;
      applyGaSwitch();
      const now = readConsent();
      setShow(now === null);
      if (now === "accepted") loadTrackers();
    };
    window.addEventListener("brandscout-consent-reset", onReset);
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("brandscout-consent-reset", onReset);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const choose = (value: "accepted" | "declined") => {
    saveConsent(value);
    if (value === "declined") {
      try {
        window.localStorage.removeItem("brandscout-history");
      } catch {
        /* ignore */
      }
    }
    setShow(false);
    loadTrackers();
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie choices"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 px-4 py-3 shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-gray-700">
          We&apos;d like to use analytics cookies (Google Analytics, Microsoft Clarity session
          recording, Ahrefs) to see how visitors use BrandScout, and to keep your recent searches in
          this browser. They stay off unless you allow them.{" "}
          <a href="/privacy" className="underline hover:text-gray-900">
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-900 text-gray-900 bg-white hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-900 bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
