// Regex, wildcard, and multi-keyword search utilities

const FILLER_WORDS = ["cool", "best", "top", "pro", "go", "my", "the", "hub", "lab", "io", "app", "dev", "ai", "co", "net", "digital", "smart", "fast", "ez", "one"];

export function expandWildcard(pattern: string): string[] {
  if (!pattern.includes("*")) return [pattern];
  const [prefix, suffix] = pattern.split("*", 2);
  const results: string[] = [prefix + suffix]; // no filler
  for (const word of FILLER_WORDS) {
    results.push(prefix + word + suffix);
    if (results.length >= 20) break;
  }
  return results;
}

export function expandPattern(pattern: string): string[] {
  // ?? = any 2 letters, * = any word
  if (pattern.includes("?")) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let results = [""];
    for (const ch of pattern) {
      if (ch === "?") {
        const next: string[] = [];
        for (const r of results) {
          // Only use a few chars to avoid explosion
          for (const c of "aeioubcdfghlmnprst") {
            next.push(r + c);
            if (next.length >= 20) break;
          }
          if (next.length >= 20) break;
        }
        results = next.slice(0, 20);
      } else {
        results = results.map(r => r + ch);
      }
    }
    return results.slice(0, 20);
  }
  return expandWildcard(pattern);
}

export function parseMultiKeyword(input: string): string[] {
  // "tech AND hub" => ["techhub"]
  // "cool OR awesome + brand" => ["coolbrand", "awesomebrand"]
  const normalized = input.trim();

  if (/\bAND\b/i.test(normalized)) {
    const parts = normalized.split(/\s+AND\s+/i).map(s => s.trim().toLowerCase());
    // Combine all parts
    return [parts.join("")];
  }

  if (/\bOR\b/i.test(normalized) || normalized.includes("+")) {
    // Split by OR and +
    const segments = normalized.split(/\s+OR\s+|\s*\+\s*/i).map(s => s.trim().toLowerCase());
    // Find if there's a "base" word (last segment or segments without OR)
    const results: string[] = [];
    // Generate combos: each segment combined
    if (segments.length >= 2) {
      const base = segments[segments.length - 1];
      for (let i = 0; i < segments.length - 1; i++) {
        results.push(segments[i] + base);
        results.push(base + segments[i]);
      }
    }
    if (results.length === 0) return segments;
    return results.slice(0, 20);
  }

  return [normalized.toLowerCase().replace(/\s+/g, "")];
}
