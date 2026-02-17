// Feature 40: In-memory cache with TTL

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TTLCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.store.clear();
  }

  // Periodic cleanup of expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) this.store.delete(key);
    }
  }
}

export const cache = new TTLCache();

// TTL constants
export const DOMAIN_CACHE_TTL = 5 * 60 * 1000;   // 5 minutes
export const USERNAME_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Helper to create cache keys
export function domainCacheKey(domain: string): string {
  return `domain:${domain.toLowerCase()}`;
}

export function usernameCacheKey(platform: string, username: string): string {
  return `username:${platform.toLowerCase()}:${username.toLowerCase()}`;
}
