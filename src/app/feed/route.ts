export const revalidate = 3600; // revalidate hourly

const API_URL = process.env.BLOG_API_URL || "https://blog-api.zenith-digital.workers.dev";

export async function GET() {
  const res = await fetch(`${API_URL}/feed/brandscout`);
  const xml = await res.text();
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
