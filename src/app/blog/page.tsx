import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips and guides on brand naming, domain strategy, and building your online presence.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <article className="p-4 rounded-xl bg-surface hover:bg-muted transition-colors">
              <h2 className="text-lg font-semibold group-hover:underline">{post.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{post.date}</p>
              <p className="text-sm mt-2">{post.excerpt}</p>
            </article>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground">No posts yet.</p>}
      </div>
    </div>
  );
}
