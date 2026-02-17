// Shareable dashboard links - base64 encode/decode search data

import type { SearchResults } from "@/components/search-form";

export function createShareLink(data: SearchResults): string {
  const compressed = {
    q: data.query,
    n: data.name,
    t: data.type,
    s: data.score,
    d: data.domains.map(d => ({ d: d.domain, t: d.tld, s: d.status })),
    u: data.usernames.map(u => ({ p: u.platform, u: u.username, s: u.status, c: u.confidence })),
    sg: data.suggestions,
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(compressed)));
  return `${window.location.origin}/share?data=${encoded}`;
}

export function decodeShareLink(data: string): SearchResults | null {
  try {
    const json = JSON.parse(decodeURIComponent(atob(data)));
    return {
      id: "shared",
      query: json.q,
      name: json.n,
      type: json.t,
      score: json.s,
      domains: json.d.map((d: { d: string; t: string; s: string }) => ({ domain: d.d, tld: d.t, status: d.s, source: "shared" })),
      usernames: json.u.map((u: { p: string; u: string; s: string; c: number }) => ({ platform: u.p, username: u.u, status: u.s, profileUrl: "", confidence: u.c })),
      suggestions: json.sg || [],
    };
  } catch { return null; }
}
