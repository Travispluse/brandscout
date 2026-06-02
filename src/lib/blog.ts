import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const API_URL = process.env.BLOG_API_URL || "https://blog-api.zenith-digital.workers.dev";
const SITE = "brandscout";
const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const DEFAULT_BLOG_IMAGE = "/og-image.png";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  reading_time: string;
}

interface ApiPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  reading_time: string;
  image_url: string;
}

interface LocalPostFrontmatter {
  title?: string;
  date?: string;
  excerpt?: string;
  description?: string;
  category?: string;
  image_url?: string;
  reading_time?: string;
}

function mapPost(p: ApiPost): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.description,
    content: p.content,
    category: p.category || "brand-naming",
    image_url: p.image_url || DEFAULT_BLOG_IMAGE,
    reading_time: p.reading_time || "",
  };
}

function isPublishableRemotePost(p: ApiPost): boolean {
  const slug = (p.slug || "").trim().toLowerCase();
  const title = (p.title || "").trim().toLowerCase();
  const description = (p.description || "").trim().toLowerCase();

  return (
    title !== "test" &&
    title !== "test post" &&
    description !== "test" &&
    description !== "test desc" &&
    !slug.startsWith("test-post-from-")
  );
}

function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 230))} min read`;
}

async function getLocalPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file) => {
          const slug = file.replace(/\.mdx$/, "");
          const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
          const { data, content } = matter(raw);
          const frontmatter = data as LocalPostFrontmatter;

          return {
            slug,
            title: frontmatter.title || slug.replace(/-/g, " "),
            date: frontmatter.date || "",
            excerpt: frontmatter.excerpt || frontmatter.description || "",
            content,
            category: frontmatter.category || "brand-naming",
            image_url: frontmatter.image_url || DEFAULT_BLOG_IMAGE,
            reading_time: frontmatter.reading_time || estimateReadingTime(content),
          };
        })
    );

    return posts.sort((a, b) => b.date.localeCompare(a.date));
  } catch (e) {
    console.error("Local blog load error:", e);
    return [];
  }
}

function mergePosts(localPosts: BlogPost[], remotePosts: BlogPost[]): BlogPost[] {
  const bySlug = new Map<string, BlogPost>();

  for (const post of remotePosts) bySlug.set(post.slug, post);
  for (const post of localPosts) bySlug.set(post.slug, post);

  return Array.from(bySlug.values()).sort((a, b) => b.date.localeCompare(a.date));
}

// Cache for build-time / ISR
let postsCache: BlogPost[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

async function fetchPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (postsCache && now - cacheTime < CACHE_TTL) return postsCache;

  const localPosts = await getLocalPosts();
  
  try {
    const res = await fetch(`${API_URL}/posts?site=${SITE}&limit=500`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    postsCache = mergePosts(localPosts, (data.posts || []).filter(isPublishableRemotePost).map(mapPost));
    cacheTime = now;
    return postsCache!;
  } catch (e) {
    console.error("Blog API fetch error:", e);
    // Return cache even if stale
    if (postsCache) return postsCache;
    postsCache = localPosts;
    cacheTime = now;
    return postsCache;
  }
}

export function getAllPosts(): BlogPost[] {
  // For SSG/build-time, we need synchronous. Use a workaround.
  // This will be called during build - we pre-fetch in generateStaticParams
  if (postsCache) return postsCache;
  // Fallback: trigger async fetch (works for ISR/SSR)
  return [];
}

export async function getAllPostsAsync(): Promise<BlogPost[]> {
  return fetchPosts();
}

export async function getLocalPostsAsync(): Promise<BlogPost[]> {
  return getLocalPosts();
}

export async function getPostAsync(slug: string): Promise<BlogPost | null> {
  const localPost = (await getLocalPosts()).find((post) => post.slug === slug);
  if (localPost) return localPost;

  try {
    const res = await fetch(`${API_URL}/posts/${SITE}/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!isPublishableRemotePost(data)) return null;
    return mapPost(data);
  } catch {
    return null;
  }
}

export function getPost(slug: string): BlogPost | null {
  if (!postsCache) return null;
  return postsCache.find(p => p.slug === slug) || null;
}

export const CATEGORIES: Record<string, { label: string; description: string }> = {
  "brand-naming": { label: "Brand Naming", description: "Tips and strategies for choosing the perfect brand name." },
  "domain-strategy": { label: "Domain Strategy", description: "Master domain selection, extensions, and acquisition." },
  "social-handles": { label: "Social Handles", description: "Secure consistent usernames across social platforms." },
  "business-legal": { label: "Business & Legal", description: "Trademarks, registration, and legal considerations." },
  "ecommerce": { label: "E-Commerce", description: "Branding strategies for online stores and marketplaces." },
  "industry-guides": { label: "Industry Guides", description: "Naming guides for specific industries and niches." },
  "technical": { label: "Technical", description: "APIs, SEO, DNS, and technical branding infrastructure." },
  "branding-strategy": { label: "Branding Strategy", description: "Brand positioning, identity, and long-term strategy." },
  "growth-marketing": { label: "Growth & Marketing", description: "Marketing strategies to grow your brand presence." },
  "guides": { label: "Guides", description: "Step-by-step guides, checklists, and best practices." },
  "advanced-domains": { label: "Advanced Domains", description: "Premium domains, investing, and advanced strategies." },
  "platform-guides": { label: "Platform Guides", description: "Guides for specific registrars and platforms." },
  "emerging-trends": { label: "Emerging Trends", description: "Future trends in branding, AI, and digital identity." },
  "naming-strategies": { label: "Naming Strategies", description: "Strategic approaches to brand naming." },
  "social-media": { label: "Social Media", description: "Social media branding and presence." },
  "seo": { label: "SEO", description: "SEO and search visibility for brands." },
  "tools": { label: "Tools", description: "Tools and resources for brand building." },
  "personal-branding": { label: "Personal Branding", description: "Building your personal brand." },
  "legal": { label: "Legal", description: "Legal aspects of brand naming." },
};

export function getPostsByCategory(category: string): BlogPost[] {
  if (!postsCache) return [];
  return postsCache.filter(p => p.category === category);
}

export async function getPostsByCategoryAsync(category: string): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  return posts.filter(p => p.category === category);
}
