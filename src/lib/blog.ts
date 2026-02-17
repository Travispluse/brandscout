import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        excerpt: data.excerpt || "",
        content,
        category: data.category || "brand-naming",
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    excerpt: data.excerpt || "",
    content,
    category: data.category || "brand-naming",
  };
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
};

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(p => p.category === category);
}
