import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    schema_version: "v1",
    name_for_human: "BrandScout",
    name_for_model: "brandscout",
    description_for_human: "Check domain and social media username availability for any brand name.",
    description_for_model: "Use BrandScout to check if a brand name, domain, or username is available across domains (.com, .io, .ai, etc.) and social platforms (GitHub, Reddit, Twitch, etc.). Returns availability status, a score, and alternative suggestions. Use GET /api/v1/check?q=brandname for quick checks.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: "https://brandscout.net/api/openapi.json",
    },
    logo_url: "https://brandscout.net/favicon.ico",
    contact_email: "hello@brandscout.net",
    legal_info_url: "https://brandscout.net",
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
