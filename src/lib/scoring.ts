export interface ScoreInput {
  domainResults: { tld: string; status: string }[];
  usernameResults: { platform: string; status: string }[];
  name: string;
}

export function calculateScore(input: ScoreInput): number {
  const { domainResults, usernameResults, name } = input;

  // 40% platform availability
  const platformTotal = usernameResults.length || 1;
  const platformAvailable = usernameResults.filter(u => u.status === "available").length;
  const platformScore = (platformAvailable / platformTotal) * 40;

  // 30% domain quality (.com worth more)
  const domainWeights: Record<string, number> = {
    ".com": 3, ".net": 2, ".org": 2, ".co": 1.5, ".io": 1.5, ".ai": 1, ".app": 1,
  };
  const domainTotal = Object.values(domainWeights).reduce((a, b) => a + b, 0);
  const domainAvailable = domainResults
    .filter(d => d.status === "available")
    .reduce((sum, d) => sum + (domainWeights[d.tld] || 1), 0);
  const domainScore = (domainAvailable / domainTotal) * 30;

  // 20% readability (simple heuristic: no numbers, pronounceable)
  const hasNumbers = /\d/.test(name);
  const hasSpecial = /[^a-zA-Z0-9]/.test(name);
  const vowelRatio = (name.match(/[aeiou]/gi) || []).length / name.length;
  let readability = 20;
  if (hasNumbers) readability -= 5;
  if (hasSpecial) readability -= 5;
  if (vowelRatio < 0.15 || vowelRatio > 0.7) readability -= 5;
  readability = Math.max(0, readability);

  // 10% length bonus (sweet spot 5-12 chars)
  let lengthScore = 10;
  if (name.length < 3) lengthScore = 2;
  else if (name.length < 5) lengthScore = 6;
  else if (name.length <= 12) lengthScore = 10;
  else if (name.length <= 20) lengthScore = 6;
  else lengthScore = 2;

  return Math.round(platformScore + domainScore + readability + lengthScore);
}
