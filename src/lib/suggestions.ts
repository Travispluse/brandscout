const prefixes = ["go", "get", "try", "use", "my", "the", "hey"];
const suffixes = ["hq", "app", "hub", "lab", "co", "io", "now", "dev"];

export function generateSuggestions(name: string): string[] {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suggestions = new Set<string>();

  for (const prefix of prefixes) {
    suggestions.add(`${prefix}${clean}`);
  }
  for (const suffix of suffixes) {
    suggestions.add(`${clean}${suffix}`);
  }
  // Abbreviations
  if (clean.length > 6) {
    suggestions.add(clean.slice(0, 4));
    suggestions.add(clean.slice(0, 3) + clean.slice(-2));
  }

  suggestions.delete(clean);
  return Array.from(suggestions).slice(0, 8);
}
