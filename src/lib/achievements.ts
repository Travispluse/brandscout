// Achievements system - tracked in localStorage

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  totalSearches: number;
  highestScore: number;
  usedBulk: boolean;
  usedCompare: boolean;
  usedGenerator: boolean;
  savedCount: number;
  searchedAfterMidnight: boolean;
  streak: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-search", name: "First Search", description: "Completed your first search", icon: "🔍", condition: (s) => s.totalSearches >= 1 },
  { id: "explorer", name: "Explorer", description: "Searched 10 names", icon: "🧭", condition: (s) => s.totalSearches >= 10 },
  { id: "power-user", name: "Power User", description: "Searched 50 names", icon: "⚡", condition: (s) => s.totalSearches >= 50 },
  { id: "name-hunter", name: "Name Hunter", description: "Searched 100 names", icon: "🎯", condition: (s) => s.totalSearches >= 100 },
  { id: "perfect-score", name: "Perfect Score", description: "Found a name with 90+ score", icon: "💎", condition: (s) => s.highestScore >= 90 },
  { id: "bulk-master", name: "Bulk Master", description: "Used bulk upload", icon: "📦", condition: (s) => s.usedBulk },
  { id: "comparator", name: "Comparator", description: "Used A/B compare", icon: "⚖️", condition: (s) => s.usedCompare },
  { id: "generator", name: "Generator", description: "Used AI name generator", icon: "🤖", condition: (s) => s.usedGenerator },
  { id: "saver", name: "Saver", description: "Saved 5 searches", icon: "💾", condition: (s) => s.savedCount >= 5 },
  { id: "night-owl", name: "Night Owl", description: "Searched after midnight", icon: "🦉", condition: (s) => s.searchedAfterMidnight },
];

const STORAGE_KEY = "brandscout-achievements";
const STATS_KEY = "brandscout-achievement-stats";
const STREAK_KEY = "brandscout-streak";

export function getStats(): AchievementStats {
  if (typeof window === "undefined") return { totalSearches: 0, highestScore: 0, usedBulk: false, usedCompare: false, usedGenerator: false, savedCount: 0, searchedAfterMidnight: false, streak: 0 };
  try {
    const raw = localStorage.getItem(STATS_KEY);
    const defaults: AchievementStats = { totalSearches: 0, highestScore: 0, usedBulk: false, usedCompare: false, usedGenerator: false, savedCount: 0, searchedAfterMidnight: false, streak: 0 };
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch { return { totalSearches: 0, highestScore: 0, usedBulk: false, usedCompare: false, usedGenerator: false, savedCount: 0, searchedAfterMidnight: false, streak: 0 }; }
}

export function updateStats(partial: Partial<AchievementStats>): string[] {
  const stats = { ...getStats(), ...partial };
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return checkAndUnlock(stats);
}

export function trackSearch(score: number): string[] {
  const stats = getStats();
  stats.totalSearches += 1;
  if (score > stats.highestScore) stats.highestScore = score;
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) stats.searchedAfterMidnight = true;
  stats.streak = updateStreak();
  // Update saved count from localStorage
  try {
    const favs = JSON.parse(localStorage.getItem("brandscout-favorites") || "[]");
    stats.savedCount = favs.length;
  } catch { /* ignore */ }
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return checkAndUnlock(stats);
}

export function getUnlocked(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function checkAndUnlock(stats: AchievementStats): string[] {
  const unlocked = getUnlocked();
  const newlyUnlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!unlocked.includes(a.id) && a.condition(stats)) {
      unlocked.push(a.id);
      newlyUnlocked.push(a.id);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
  return newlyUnlocked;
}

export function updateStreak(): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (!raw) {
      localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: today, count: 1 }));
      return 1;
    }
    const data = JSON.parse(raw);
    if (data.lastDate === today) return data.count;
    if (data.lastDate === yesterday) {
      data.count += 1;
      data.lastDate = today;
    } else {
      data.count = 1;
      data.lastDate = today;
    }
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    return data.count;
  } catch { return 1; }
}

export function getStreak(): { count: number; lastDate: string } {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0, lastDate: "" };
    return JSON.parse(raw);
  } catch { return { count: 0, lastDate: "" }; }
}
