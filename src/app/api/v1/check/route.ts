import { NextRequest, NextResponse } from "next/server";
import { parseInput } from "@/lib/input-parser";
import { checkAllDomains, TLDS } from "@/lib/domain-check";
import { checkAllUsernames, PLATFORMS } from "@/lib/username-check";
import { calculateScore } from "@/lib/scoring";
import { generateSuggestions } from "@/lib/suggestions";
import { rateLimit } from "@/lib/rate-limit";
import { analyzePronunciation, analyzeNameStrength, analyzeSentiment, analyzeTrademarkRisk, getScoreBreakdown } from "@/lib/name-analysis";
import { analyzeMarket } from "@/lib/market-analysis";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
  };
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: corsHeaders() });
}

function generateAIDescription(name: string, domains: any[], usernames: any[]): string {
  const availDomains = domains.filter((d) => d.status === "available").map((d) => d.domain);
  const takenDomains = domains.filter((d) => d.status === "taken").map((d) => d.domain);
  const availUsernames = usernames.filter((u) => u.status === "available").map((u) => u.platform);
  const takenUsernames = usernames.filter((u) => u.status === "taken").map((u) => u.platform);

  const parts: string[] = [];
  if (availDomains.length) parts.push(`${availDomains.join(", ")} ${availDomains.length === 1 ? "is" : "are"} available`);
  if (takenDomains.length) parts.push(`${takenDomains.join(", ")} ${takenDomains.length === 1 ? "is" : "are"} taken`);
  if (availUsernames.length) parts.push(`usernames available on ${availUsernames.join(", ")}`);
  if (takenUsernames.length) parts.push(`usernames taken on ${takenUsernames.join(", ")}`);

  return `Brand "${name}": ${parts.join("; ")}.`;
}

async function handleCheck(query: string, tldFilter?: string[], platformFilter?: string[]) {
  const { type, value } = parseInput(query);

  let [domainResults, usernameResults] = await Promise.all([
    checkAllDomains(value),
    checkAllUsernames(value),
  ]);

  if (tldFilter?.length) {
    const normalized = tldFilter.map((t) => (t.startsWith(".") ? t : `.${t}`));
    domainResults = domainResults.filter((d) => normalized.includes(d.tld));
  }

  if (platformFilter?.length) {
    const lower = platformFilter.map((p) => p.toLowerCase());
    usernameResults = usernameResults.filter((u) => lower.includes(u.platform.toLowerCase()));
  }

  const score = calculateScore({ domainResults, usernameResults, name: value });
  const suggestions = generateSuggestions(value);

  const description_for_ai = generateAIDescription(value, domainResults, usernameResults);

  // Name analysis
  const pronunciation = analyzePronunciation(value);
  const nameStrength = analyzeNameStrength(value);
  const sentiment = analyzeSentiment(value);
  const trademarkRisk = analyzeTrademarkRisk(value);
  const scoreBreakdown = getScoreBreakdown(domainResults, usernameResults, value);
  const market = analyzeMarket(domainResults, usernameResults);

  return {
    query,
    name: value,
    score,
    description_for_ai,
    domains: domainResults.map(({ domain, tld, status, source }) => ({ domain, tld, status, source })),
    usernames: usernameResults.map(({ platform, username, status, profileUrl, confidence }) => ({ platform, username, status, profileUrl, confidence })),
    suggestions,
    analysis: {
      pronunciation: { rating: pronunciation.rating, details: pronunciation.details },
      nameStrength: { badge: nameStrength.badge, score: nameStrength.score, reasons: nameStrength.reasons },
      sentiment: { rating: sentiment.rating, details: sentiment.details },
      trademarkRisk: { level: trademarkRisk.level, warnings: trademarkRisk.warnings, searchUrl: trademarkRisk.searchUrl },
      scoreBreakdown: {
        domainAvailable: scoreBreakdown.domainAvailable,
        domainTotal: scoreBreakdown.domainTotal,
        domainPercent: scoreBreakdown.domainPercent,
        platformAvailable: scoreBreakdown.platformAvailable,
        platformTotal: scoreBreakdown.platformTotal,
        platformPercent: scoreBreakdown.platformPercent,
        readabilityRating: scoreBreakdown.readabilityRating,
        lengthRating: scoreBreakdown.lengthRating,
        lengthChars: scoreBreakdown.lengthChars,
        tips: scoreBreakdown.tips,
      },
      market: {
        nicheDemand: market.nicheDemand,
        marketOpportunity: market.marketOpportunity,
        explanation: market.explanation,
        demandScore: market.demandScore,
      },
    },
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(ip);
  if (!rl.ok) return errorResponse("Rate limit exceeded. Try again later.", 429);

  const q = req.nextUrl.searchParams.get("q") || req.nextUrl.searchParams.get("query");
  if (!q || q.trim().length === 0) return errorResponse("Missing required query parameter: q", 400);
  if (q.length > 63) return errorResponse("Query too long (max 63 characters)", 400);

  const tlds = req.nextUrl.searchParams.get("tlds")?.split(",").filter(Boolean);
  const platforms = req.nextUrl.searchParams.get("platforms")?.split(",").filter(Boolean);

  const result = await handleCheck(q.trim(), tlds, platforms);
  return NextResponse.json(result, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(ip);
  if (!rl.ok) return errorResponse("Rate limit exceeded. Try again later.", 429);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const query = body.query;
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return errorResponse("Missing required field: query", 400);
  }
  if (query.length > 63) return errorResponse("Query too long (max 63 characters)", 400);

  const tlds = req.nextUrl.searchParams.get("tlds")?.split(",").filter(Boolean) || body.tlds;
  const platforms = req.nextUrl.searchParams.get("platforms")?.split(",").filter(Boolean) || body.platforms;

  const result = await handleCheck(query.trim(), tlds, platforms);
  return NextResponse.json(result, { headers: corsHeaders() });
}
