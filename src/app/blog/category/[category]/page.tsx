import { getPostsByCategoryAsync, CATEGORIES } from "@/lib/blog";
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
    openGraph: {
      title: `${cat.label} Articles | BrandScout`,
      description: cat.description,
      siteName: "BrandScout",
      images: [{ url: "/og-image.png", width: 1024, height: 1024, alt: cat.label }],
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const posts = await getPostsByCategoryAsync(category);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: cat.label },
        ]} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{cat.label}</h1>
        <p className="text-gray-500 mb-8">{cat.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col">
                <div className="h-44 relative overflow-hidden bg-gray-100">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title.replace(/\s*\|.*$/, "")}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100" />
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title.replace(/\s*\|.*$/, "")}
                  </h2>
                  {post.excerpt && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400">{post.date}</span>
                    <span className="text-[11px] font-medium text-blue-600 group-hover:underline">Read →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        {posts.length === 0 && <p className="text-gray-500 text-center py-12">No posts in this category yet.</p>}
      </div>
    </div>
  );
}
