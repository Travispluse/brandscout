import { getPostsByCategory, CATEGORIES } from "@/lib/blog";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Params = Promise<{ category: string }>;

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) return { title: "Not Found" };
  return {
    title: `${cat.label} Articles`,
    description: cat.description,
    alternates: { canonical: `/blog/category/${category}` },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const posts = getPostsByCategory(category);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: cat.label },
      ]} />
      <h1 className="text-3xl font-bold mb-2">{cat.label}</h1>
      <p className="text-muted-foreground mb-8">{cat.description}</p>
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
        {posts.length === 0 && <p className="text-muted-foreground">No posts in this category yet.</p>}
      </div>
    </div>
  );
}
