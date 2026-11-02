// Simple in-memory rate limiter
const hits = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 30;

export function rateLimit(ip: string): { ok: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    return { ok: false, remaining: 0, resetMs: oldest + WINDOW_MS - now };
  }

  timestamps.push(now);
  hits.set(ip, timestamps);

  return { ok: true, remaining: MAX_REQUESTS - timestamps.length, resetMs: WINDOW_MS };
}
