import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const siteUrl = "https://brandscout.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date || new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: siteUrl, lastModified: new Date().toISOString(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date().toISOString(), changeFrequency: "weekly", priority: 0.7 },
    ...posts,
  ];
}
