// Client-side name analysis utilities

// ====== Pronunciation Checker (Feature 152) ======
const CONSONANT_CLUSTERS = /[bcdfghjklmnpqrstvwxyz]{3,}/gi;
const AMBIGUOUS_COMBOS = /gh|ph|ough|tion|sion|tch|sch|thr|chr|psy|pn|kn|wr|mn/gi;

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  let count = (w.match(/[aeiouy]+/g) || []).length;
  if (w.endsWith("e") && !w.endsWith("le")) count--;
  if (w.endsWith("le") && w.length > 2 && !/[aeiouy]/.test(w[w.length - 3])) count++;
  return Math.max(1, count);
}

export function analyzePronunciation(name: string): { rating: "Easy to pronounce" | "Moderate" | "Tricky to pronounce"; details: string[] } {
  const clean = name.replace(/[^a-zA-Z]/g, "");
  const details: string[] = [];
  let score = 0; // higher = harder

  const clusters = (clean.match(CONSONANT_CLUSTERS) || []);
  if (clusters.length > 0) {
    score += clusters.length * 2;
    details.push(`${clusters.length} consonant cluster(s)`);
  }

  const ambiguous = (clean.match(AMBIGUOUS_COMBOS) || []);
  if (ambiguous.length > 0) {
    score += ambiguous.length;
    details.push(`Ambiguous combos: ${[...new Set(ambiguous.map(a => a.toLowerCase()))].join(", ")}`);
  }

  const syllables = countSyllables(clean);
  if (syllables > 4) { score += 2; details.push(`${syllables} syllables (long)`); }
  else if (syllables > 3) { score += 1; details.push(`${syllables} syllables`); }
  else { details.push(`${syllables} syllable(s)`); }

  const vowelRatio = (clean.match(/[aeiou]/gi) || []).length / (clean.length || 1);
  if (vowelRatio < 0.15) { score += 2; details.push("Very few vowels"); }
  else if (vowelRatio > 0.65) { score += 1; details.push("Many vowels"); }

  if (score >= 4) return { rating: "Tricky to pronounce", details };
  if (score >= 2) return { rating: "Moderate", details };
  return { rating: "Easy to pronounce", details };
}

// ====== Name Strength Rating (Feature 94) ======
export function analyzeNameStrength(name: string): { badge: "Strong Name" | "Good Name" | "Needs Work"; score: number; reasons: string[] } {
  const clean = name.replace(/[^a-zA-Z0-9]/g, "");
  let score = 0;
  const reasons: string[] = [];

  // Length (ideal 5-10)
  if (clean.length >= 5 && clean.length <= 10) { score += 25; reasons.push("Ideal length"); }
  else if (clean.length >= 3 && clean.length <= 14) { score += 15; reasons.push("Acceptable length"); }
  else { score += 5; reasons.push(clean.length < 3 ? "Too short" : "Too long"); }

  // Pronounceability
  const pron = analyzePronunciation(name);
  if (pron.rating === "Easy to pronounce") { score += 25; reasons.push("Easy to say"); }
  else if (pron.rating === "Moderate") { score += 15; reasons.push("Moderately easy to say"); }
  else { score += 5; reasons.push("Hard to pronounce"); }

  // Memorability (no numbers, no special chars, short)
  if (!/\d/.test(clean) && clean.length <= 12) { score += 20; reasons.push("Memorable"); }
  else if (/\d/.test(clean)) { score += 5; reasons.push("Numbers reduce memorability"); }
  else { score += 10; reasons.push("Moderately memorable"); }

  // Spelling simplicity
  const hasDoubles = /(.)\1{2,}/.test(clean);
  const hasUncommon = /[xzqj]/i.test(clean);
  if (!hasDoubles && !hasUncommon) { score += 15; reasons.push("Easy to spell"); }
  else if (hasDoubles) { score += 5; reasons.push("Repeated letters may confuse"); }
  else { score += 10; reasons.push("Contains uncommon letters"); }

  // Uniqueness (not a super common word)
  const commonWords = ["the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "way", "who", "did", "let", "say", "she", "too", "use", "best", "good", "make", "like", "just", "know", "take", "come", "more", "find", "here", "thing", "many", "some", "time", "very", "when", "what", "your", "work", "first", "also", "after", "well", "only"];
  if (!commonWords.includes(clean.toLowerCase())) { score += 15; reasons.push("Unique/distinctive"); }
  else { score += 3; reasons.push("Common word — less distinctive"); }

  const badge = score >= 75 ? "Strong Name" : score >= 50 ? "Good Name" : "Needs Work";
  return { badge, score, reasons };
}

// ====== Sentiment Analysis (Feature 151) ======
const POSITIVE_WORDS = ["bright", "star", "nova", "zen", "bloom", "rise", "swift", "gold", "prime", "elite", "apex", "peak", "shine", "glow", "spark", "joy", "win", "ace", "hero", "dream", "hope", "trust", "pure", "clear", "bold", "power", "vital", "thrive", "bliss", "grace", "smart", "noble"];
const NEGATIVE_WORDS = ["die", "dead", "kill", "hate", "war", "hell", "damn", "evil", "pain", "fail", "loss", "sick", "ugly", "dumb", "crud", "crap", "rot", "doom", "dread", "grief", "harm", "toxic", "waste", "weak", "broke", "crash", "drain", "fraud", "scam", "spam", "virus", "bug"];
const NEGATIVE_SOUNDS = ["ass", "shit", "fuk", "fuc", "dic", "piss", "slut", "bich"];

export function analyzeSentiment(name: string): { rating: "Positive associations" | "Neutral" | "⚠️ Potential negative associations"; details: string[] } {
  const lower = name.toLowerCase().replace(/[^a-z]/g, "");
  const details: string[] = [];

  // Check for negative sounds/substrings
  for (const neg of NEGATIVE_SOUNDS) {
    if (lower.includes(neg)) {
      details.push(`Contains "${neg}" sound`);
      return { rating: "⚠️ Potential negative associations", details };
    }
  }

  // Check for negative words
  for (const neg of NEGATIVE_WORDS) {
    if (lower === neg || lower.includes(neg)) {
      details.push(`Contains "${neg}"`);
      return { rating: "⚠️ Potential negative associations", details };
    }
  }

  // Check for positive words
  for (const pos of POSITIVE_WORDS) {
    if (lower === pos || lower.includes(pos)) {
      details.push(`Contains "${pos}" — positive connotation`);
      return { rating: "Positive associations", details };
    }
  }

  details.push("No strong positive or negative associations detected");
  return { rating: "Neutral", details };
}

// ====== Trademark Risk (Feature 153) ======
const COMMON_ENGLISH_WORDS = new Set(["apple", "amazon", "window", "table", "chair", "water", "fire", "earth", "air", "light", "dark", "black", "white", "blue", "green", "red", "orange", "book", "door", "house", "room", "food", "fish", "bird", "tree", "flower", "music", "video", "game", "play", "cloud", "rain", "snow", "sun", "moon", "star", "rock", "stone", "iron", "steel", "glass", "wood", "paper", "gold", "silver", "diamond", "pearl", "ocean", "river", "lake", "mountain", "forest", "garden", "field", "bridge", "tower", "castle", "crown", "king", "queen", "knight", "angel", "dragon", "wolf", "fox", "bear", "eagle", "hawk", "lion", "tiger", "spark", "flash", "bolt", "wave", "pulse", "core", "edge", "peak", "summit", "base", "root", "seed", "bloom", "harvest", "orbit", "nexus", "prism", "atlas", "titan", "nova", "zenith"]);

export function analyzeTrademarkRisk(name: string): { level: "Low" | "Medium" | "High"; warnings: string[]; searchUrl: string } {
  const lower = name.toLowerCase().replace(/[^a-z]/g, "");
  const warnings: string[] = [];
  let level: "Low" | "Medium" | "High" = "Low";

  if (COMMON_ENGLISH_WORDS.has(lower)) {
    warnings.push("Common English word — higher trademark risk and harder to protect");
    level = "High";
  }

  if (lower.length <= 2) {
    warnings.push("Very short names are difficult to trademark");
    level = level === "Low" ? "Medium" : level;
  }

  if (/^(get|my|the|go|try|best|top|pro|super)/.test(lower)) {
    warnings.push("Generic prefix may weaken trademark strength");
    level = level === "Low" ? "Medium" : level;
  }

  if (warnings.length === 0) {
    warnings.push("No obvious trademark concerns detected");
  }

  warnings.push("Always verify with a trademark attorney before registering");

  const searchUrl = `https://www.uspto.gov/trademarks/search`;

  return { level, warnings, searchUrl };
}

// ====== Score Breakdown (Feature 92) ======
export interface ScoreBreakdown {
  domainAvailable: number;
  domainTotal: number;
  domainPercent: number;
  platformAvailable: number;
  platformTotal: number;
  platformPercent: number;
  readabilityRating: string;
  lengthRating: string;
  lengthChars: number;
  tips: string[];
}

export function getScoreBreakdown(
  domains: { domain: string; tld: string; status: string }[],
  usernames: { platform: string; status: string }[],
  name: string
): ScoreBreakdown {
  const domainAvailable = domains.filter(d => d.status === "available").length;
  const domainTotal = domains.length;
  const platformAvailable = usernames.filter(u => u.status === "available").length;
  const platformTotal = usernames.length;

  const vowelRatio = (name.match(/[aeiou]/gi) || []).length / (name.length || 1);
  const hasNumbers = /\d/.test(name);
  let readabilityRating = "Good";
  if (hasNumbers || /[^a-zA-Z0-9]/.test(name)) readabilityRating = "Fair";
  if (vowelRatio < 0.15 || vowelRatio > 0.7) readabilityRating = "Fair";
  if (!hasNumbers && vowelRatio >= 0.25 && vowelRatio <= 0.5) readabilityRating = "Excellent";

  let lengthRating = "Ideal";
  if (name.length < 3) lengthRating = "Too short";
  else if (name.length < 5) lengthRating = "Short";
  else if (name.length > 20) lengthRating = "Too long";
  else if (name.length > 12) lengthRating = "Long";

  const tips: string[] = [];
  const availableDomains = domains.filter(d => d.status === "available");
  if (availableDomains.length > 0) {
    tips.push(`Consider registering ${availableDomains[0].domain} while it's available`);
  }
  const comDomain = domains.find(d => d.tld === ".com");
  if (comDomain && comDomain.status === "taken") {
    tips.push("The .com domain is taken — consider .io or .co alternatives");
  }
  if (platformAvailable < platformTotal * 0.5) {
    tips.push("Many social handles are taken — consider variations like adding 'HQ' or 'App'");
  }

  return {
    domainAvailable, domainTotal, domainPercent: Math.round((domainAvailable / (domainTotal || 1)) * 100),
    platformAvailable, platformTotal, platformPercent: Math.round((platformAvailable / (platformTotal || 1)) * 100),
    readabilityRating, lengthRating, lengthChars: name.length, tips,
  };
}

// ====== Niche Idea Generator (Feature 90) ======
const NICHE_SUFFIXES = ["Hub", "Lab", "Nest", "Box", "Base", "Spot", "Zone", "Deck", "Dock", "Pad", "Bay", "Den", "Hive", "Camp", "Post", "Vault", "Works", "Forge", "Studio", "Guild"];
const NICHE_ADJECTIVES = ["Smart", "Swift", "Bold", "Fresh", "Pure", "Bright", "Noble", "Prime", "True", "Vivid", "Agile", "Keen", "Rapid", "Sharp", "Savvy"];

export function generateNicheIdeas(industry: string): { name: string; description: string }[] {
  const ideas: { name: string; description: string }[] = [];
  const clean = industry.trim();
  if (!clean) return ideas;

  const base = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  const short = base.length > 6 ? base.slice(0, Math.ceil(base.length * 0.6)) : base;

  // Industry + Suffix
  for (const suffix of NICHE_SUFFIXES.slice(0, 8)) {
    ideas.push({ name: `${short}${suffix}`, description: `${base}-focused ${suffix.toLowerCase()} platform` });
  }

  // Adjective + Industry
  for (const adj of NICHE_ADJECTIVES.slice(0, 6)) {
    ideas.push({ name: `${adj}${short}`, description: `${adj} approach to ${base.toLowerCase()}` });
  }

  // Creative combos
  ideas.push({ name: `${short}ify`, description: `Simplifying ${base.toLowerCase()}` });
  ideas.push({ name: `${short}ly`, description: `${base} made easy` });
  ideas.push({ name: `Go${short}`, description: `Your go-to ${base.toLowerCase()} solution` });
  ideas.push({ name: `${short}Pulse`, description: `The pulse of ${base.toLowerCase()}` });
  ideas.push({ name: `${short}Wave`, description: `Riding the ${base.toLowerCase()} wave` });
  ideas.push({ name: `${short}Mint`, description: `Fresh ${base.toLowerCase()} ideas` });

  return ideas.slice(0, 20);
}
