import { NextRequest, NextResponse } from "next/server";
import { searchSchema, parseInput } from "@/lib/input-parser";
import { checkAllDomains } from "@/lib/domain-check";
import { checkAllUsernames } from "@/lib/username-check";
import { calculateScore } from "@/lib/scoring";
import { generateSuggestions } from "@/lib/suggestions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = searchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { type, value } = parseInput(parsed.data.query);

    // Run checks in parallel
    const [domainResults, usernameResults] = await Promise.all([
      checkAllDomains(value),
      checkAllUsernames(value),
    ]);

    const score = calculateScore({
      domainResults,
      usernameResults,
      name: value,
    });

    const suggestions = generateSuggestions(value);

    // Save to DB if available
    let searchId = "no-db";
    if (prisma) {
      try {
        const search = await prisma.search.create({
          data: {
            inputType: type,
            inputValue: parsed.data.query,
            candidates: {
              create: {
                text: value,
                score,
                rank: 1,
                domainChecks: {
                  create: domainResults.map(d => ({
                    domain: d.domain,
                    tld: d.tld,
                    status: d.status,
                    source: d.source,
                  })),
                },
                usernameChecks: {
                  create: usernameResults.map(u => ({
                    platform: u.platform,
                    username: u.username,
                    status: u.status,
                    profileUrl: u.profileUrl,
                    source: u.source,
                    confidence: u.confidence,
                  })),
                },
              },
            },
          },
        });
        searchId = search.id;
      } catch (e) {
        console.warn("DB save failed:", e);
      }
    }

    return NextResponse.json({
      id: searchId,
      query: parsed.data.query,
      name: value,
      type,
      score,
      domains: domainResults,
      usernames: usernameResults,
      suggestions,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
