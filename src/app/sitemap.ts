import type { MetadataRoute } from "next";
import { getAllPostsAsync, CATEGORIES } from "@/lib/blog";

const siteUrl = "https://brandscout.net";

// All static pages on the site
const staticPages = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/tools", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/bulk", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/compare", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/ai-generator", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/glossary", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/templates", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/docs", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/registrars", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/achievements", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/newsletter", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/share", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/dashboard", priority: 0.4, changeFrequency: "weekly" as const },
  { path: "/saved", priority: 0.3, changeFrequency: "weekly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/editorial-policy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/privacy-settings", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsAsync();
  
  const blogEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date || new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const staticEntries = staticPages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Blog category pages
  const categoryEntries = Object.keys(CATEGORIES).map((cat) => ({
    url: `${siteUrl}/blog/category/${cat}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...blogEntries];
}
