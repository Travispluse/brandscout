import { getAllPosts, CATEGORIES } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/newsletter-signup";

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

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>

      {/* Category Links */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 flex-nowrap sm:flex-wrap">
        {Object.entries(CATEGORIES).map(([slug, cat]) => (
          <Link
            key={slug}
            href={`/blog/category/${slug}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <article className="p-4 rounded-xl bg-surface hover:bg-muted transition-colors">
              <h2 className="text-lg font-semibold group-hover:underline">{post.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{post.date}</span>
                {post.category && CATEGORIES[post.category] && (
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{CATEGORIES[post.category].label}</span>
                )}
              </div>
              <p className="text-sm mt-2">{post.excerpt}</p>
            </article>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground">No posts yet.</p>}
      </div>

      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </div>
  );
}
