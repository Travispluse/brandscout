const API_URL = process.env.BLOG_API_URL || "https://blog-api.zenith-digital.workers.dev";
const SITE = "brandscout";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
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
}

function mapPost(p: ApiPost): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.description,
    content: p.content,
    category: p.category || "brand-naming",
  };
}

// Cache for build-time / ISR
let postsCache: BlogPost[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

async function fetchPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (postsCache && now - cacheTime < CACHE_TTL) return postsCache;
  
  try {
    const res = await fetch(`${API_URL}/posts?site=${SITE}&limit=500`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    postsCache = (data.posts || []).map(mapPost);
    cacheTime = now;
    return postsCache!;
  } catch (e) {
    console.error("Blog API fetch error:", e);
    // Return cache even if stale
    if (postsCache) return postsCache;
    return [];
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

export async function getPostAsync(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/posts/${SITE}/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
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
