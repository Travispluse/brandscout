// Feature 21: Lightweight spell correction for brand names

const COMMON_WORDS = [
  "tech", "digital", "media", "cloud", "data", "smart", "pixel", "byte", "code",
  "link", "sync", "flow", "wave", "spark", "nova", "core", "edge", "peak", "zone",
  "star", "light", "bright", "swift", "rapid", "prime", "elite", "ultra", "mega",
  "micro", "nano", "mini", "maxi", "super", "hyper", "meta", "auto", "cyber",
  "design", "studio", "craft", "works", "labs", "forge", "nest", "hive", "vault",
  "pulse", "vibe", "bold", "true", "pure", "clear", "blue", "green", "red",
  "black", "white", "gold", "silver", "iron", "steel", "stone", "fire", "ice",
  "ocean", "river", "mountain", "forest", "garden", "field", "city", "urban",
  "global", "local", "north", "south", "east", "west", "atlas", "orbit", "lunar",
  "solar", "cosmic", "venture", "capital", "market", "trade", "commerce", "brand",
  "creative", "visual", "motion", "sound", "voice", "signal", "beacon", "guide",
  "scout", "finder", "seeker", "hunter", "builder", "maker", "crafter",
];

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

/** Remove consecutive duplicate characters: "creeative" → "creative" */
function dedup(word: string): string {
  return word.replace(/(.)\1+/g, "$1$1").replace(/(.)\1+/g, "$1"); // reduce to max 1 repeat, then single
}

export function suggestCorrection(input: string): string | null {
  const clean = input.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clean.length < 3 || clean.length > 30) return null;

  // Check for doubled letters
  const deduped = dedup(clean);
  if (deduped !== clean) {
    // See if deduped version is a known word or closer to one
    const match = COMMON_WORDS.find(w => w === deduped);
    if (match) return match;
  }

  // Check Levenshtein distance against dictionary
  let bestMatch: string | null = null;
  let bestDist = Infinity;

  for (const word of COMMON_WORDS) {
    if (Math.abs(word.length - clean.length) > 2) continue;
    const dist = levenshtein(clean, word);
    if (dist > 0 && dist <= 2 && dist < bestDist) {
      bestDist = dist;
      bestMatch = word;
    }
  }

  return bestMatch;
}
