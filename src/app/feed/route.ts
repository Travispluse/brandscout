import { getAllPostsAsync } from "@/lib/blog";

export const revalidate = 3600; // revalidate hourly

const SITE_URL = "https://brandscout.net";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function getFeed() {
  const posts = await getAllPostsAsync();
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;

      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid>${escapeXml(url)}</guid>`,
        post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : "",
        `<description>${escapeXml(post.excerpt || post.title)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    "<title>BrandScout Blog</title>",
    `<link>${SITE_URL}/blog</link>`,
    "<description>Brand naming tips and domain strategy.</description>",
    "<language>en-us</language>",
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `<atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />`,
    items,
    "</channel>",
    "</rss>",
  ].join("");
}

export async function GET() {
  const xml = await getFeed();

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
