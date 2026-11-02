// Niche demand indicator & market opportunity score

export interface MarketAnalysis {
  nicheDemand: "High Demand Niche" | "Moderate" | "Low Competition — Great Opportunity!";
  marketOpportunity: "High" | "Medium" | "Low";
  explanation: string;
  demandScore: number; // 0-100
}

export function analyzeMarket(
  domains: { status: string }[],
  usernames: { status: string }[]
): MarketAnalysis {
  const totalDomains = domains.length || 1;
  const takenDomains = domains.filter(d => d.status === "taken").length;
  const takenUsernames = usernames.filter(u => u.status === "taken").length;
  const totalUsernames = usernames.length || 1;

  const domainTakenRatio = takenDomains / totalDomains;
  const usernameTakenRatio = takenUsernames / totalUsernames;
  const overallTakenRatio = (domainTakenRatio + usernameTakenRatio) / 2;

  const demandScore = Math.round(overallTakenRatio * 100);

  let nicheDemand: MarketAnalysis["nicheDemand"];
  let marketOpportunity: MarketAnalysis["marketOpportunity"];
  let explanation: string;

  if (overallTakenRatio >= 0.7) {
    nicheDemand = "High Demand Niche";
    marketOpportunity = "Low";
    explanation = `${Math.round(overallTakenRatio * 100)}% of domains and handles are taken. This niche is highly competitive — act fast on any available slots.`;
  } else if (overallTakenRatio >= 0.4) {
    nicheDemand = "Moderate";
    marketOpportunity = "Medium";
    explanation = `${Math.round(overallTakenRatio * 100)}% taken. Moderate competition with decent availability remaining.`;
  } else {
    nicheDemand = "Low Competition — Great Opportunity!";
    marketOpportunity = "High";
    explanation = `Only ${Math.round(overallTakenRatio * 100)}% taken. Wide open market with great branding opportunity.`;
  }

  return { nicheDemand, marketOpportunity, explanation, demandScore };
}
