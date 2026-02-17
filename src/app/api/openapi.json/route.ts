import { NextResponse } from "next/server";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "BrandScout API",
    description: "Check domain and social media username availability for any brand name. Designed for developers, AI agents, and automation.",
    version: "1.0.0",
    contact: { url: "https://brandscout.net" },
  },
  servers: [{ url: "https://brandscout.net", description: "Production" }],
  paths: {
    "/api/v1/check": {
      get: {
        operationId: "checkBrandAvailabilityGet",
        summary: "Check brand name availability (GET)",
        description: "Check domain and username availability for a brand name. Use this for quick checks from curl or AI agents.",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string", maxLength: 63 }, description: "Brand name or domain to check" },
          { name: "tlds", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated TLD filter (e.g. com,io)" },
          { name: "platforms", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated platform filter (e.g. github,reddit)" },
          { name: "X-API-Key", in: "header", required: false, schema: { type: "string" }, description: "API key (optional, for future use)" },
        ],
        responses: {
          "200": { description: "Availability results", content: { "application/json": { schema: { $ref: "#/components/schemas/CheckResult" } } } },
          "400": { description: "Bad request" },
          "429": { description: "Rate limit exceeded" },
        },
      },
      post: {
        operationId: "checkBrandAvailabilityPost",
        summary: "Check brand name availability (POST)",
        description: "Check domain and username availability for a brand name via POST with JSON body.",
        parameters: [
          { name: "tlds", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated TLD filter" },
          { name: "platforms", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated platform filter" },
          { name: "X-API-Key", in: "header", required: false, schema: { type: "string" }, description: "API key (optional, for future use)" },
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["query"], properties: { query: { type: "string", maxLength: 63, description: "Brand name or domain to check" }, tlds: { type: "array", items: { type: "string" }, description: "TLD filter" }, platforms: { type: "array", items: { type: "string" }, description: "Platform filter" } } } } },
        },
        responses: {
          "200": { description: "Availability results", content: { "application/json": { schema: { $ref: "#/components/schemas/CheckResult" } } } },
          "400": { description: "Bad request" },
          "429": { description: "Rate limit exceeded" },
        },
      },
    },
  },
  components: {
    schemas: {
      CheckResult: {
        type: "object",
        properties: {
          query: { type: "string", description: "Original query" },
          name: { type: "string", description: "Normalized brand name" },
          score: { type: "number", description: "Availability score 0-100 (higher = more available)" },
          description_for_ai: { type: "string", description: "Natural language summary of results for AI agents" },
          domains: {
            type: "array",
            items: {
              type: "object",
              properties: {
                domain: { type: "string" },
                tld: { type: "string" },
                status: { type: "string", enum: ["available", "taken", "unknown"] },
              },
            },
          },
          usernames: {
            type: "array",
            items: {
              type: "object",
              properties: {
                platform: { type: "string" },
                username: { type: "string" },
                status: { type: "string", enum: ["available", "taken", "unknown"] },
                profileUrl: { type: "string" },
              },
            },
          },
          suggestions: { type: "array", items: { type: "string" }, description: "Alternative brand name suggestions" },
          analysis: {
            type: "object",
            description: "Detailed brand name analysis",
            properties: {
              pronunciation: {
                type: "object",
                properties: {
                  rating: { type: "string", enum: ["Easy to pronounce", "Moderate", "Tricky to pronounce"] },
                  details: { type: "array", items: { type: "string" } },
                },
              },
              nameStrength: {
                type: "object",
                properties: {
                  badge: { type: "string", enum: ["Strong Name", "Good Name", "Needs Work"] },
                  score: { type: "number", description: "Name quality score 0-100" },
                  reasons: { type: "array", items: { type: "string" } },
                },
              },
              sentiment: {
                type: "object",
                properties: {
                  rating: { type: "string", enum: ["Positive associations", "Neutral", "⚠️ Potential negative associations"] },
                  details: { type: "array", items: { type: "string" } },
                },
              },
              trademarkRisk: {
                type: "object",
                properties: {
                  level: { type: "string", enum: ["Low", "Medium", "High"] },
                  warnings: { type: "array", items: { type: "string" } },
                  searchUrl: { type: "string", description: "USPTO trademark search URL" },
                },
              },
              scoreBreakdown: {
                type: "object",
                properties: {
                  domainScore: { type: "number" },
                  platformScore: { type: "number" },
                  readabilityScore: { type: "number" },
                  lengthScore: { type: "number" },
                  tips: { type: "array", items: { type: "string" } },
                },
              },
              market: {
                type: "object",
                properties: {
                  nicheDemand: { type: "string", enum: ["High Demand Niche", "Moderate", "Low Competition — Great Opportunity!"] },
                  marketOpportunity: { type: "string", enum: ["High", "Medium", "Low"] },
                  explanation: { type: "string" },
                  demandScore: { type: "number", description: "Competition score 0-100 (higher = more competitive)" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
