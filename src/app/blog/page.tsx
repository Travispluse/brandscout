import { getAllPostsAsync, CATEGORIES } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Brand Naming Tips & Domain Strategy",
  description: "Expert tips and guides on choosing the perfect brand name, domain strategy, and securing your online presence across platforms.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | BrandScout",
    description: "Expert tips and guides on brand naming, domain strategy, and building your online presence.",
    type: "website",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  "brand-naming": "#2563eb",
  "domain-strategy": "#7c3aed",
  "social-handles": "#ec4899",
  "business-legal": "#0891b2",
  "ecommerce": "#16a34a",
  "industry-guides": "#ea580c",
  "technical": "#6366f1",
  "branding-strategy": "#0d9488",
  "growth-marketing": "#c026d3",
  "guides": "#2563eb",
  "advanced-domains": "#9333ea",
  "platform-guides": "#0284c7",
  "emerging-trends": "#d946ef",
  "naming-strategies": "#059669",
  "social-media": "#e11d48",
  "seo": "#ca8a04",
  "tools": "#475569",
  "personal-branding": "#be185d",
  "legal": "#64748b",
  "brand-strategy": "#0d9488",
};

export default async function BlogPage() {
  const posts = await getAllPostsAsync();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-500 mb-6">Expert tips on brand naming, domains, and building your online presence.</p>

        {/* Category filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 flex-nowrap sm:flex-wrap">
          {Object.entries(CATEGORIES).map(([slug, cat]) => (
            <Link key={slug} href={`/blog/category/${slug}`}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => {
            const color = CATEGORY_COLORS[post.category] || "#2563eb";
            const catLabel = CATEGORIES[post.category]?.label || post.category;
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col">
                  {/* Image */}
                  <div className="h-44 relative overflow-hidden bg-gray-100">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title.replace(/\s*\|.*$/, "")}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{
                        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
                      }}>
                        <svg className="h-12 w-12 opacity-20" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-sm" style={{ background: color }}>
                        {catLabel}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title.replace(/\s*\|.*$/, "")}
                    </h2>
                    {post.excerpt && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400">{post.date}</span>
                        {post.reading_time && <span className="text-[11px] text-gray-400">· {post.reading_time}</span>}
                      </div>
                      <span className="text-[11px] font-medium text-blue-600 group-hover:underline">Read →</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
