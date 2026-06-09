import { getPostsByCategoryAsync, CATEGORIES } from "@/lib/blog";
import { toBlogTablePosts } from "@/lib/blog-table-posts";
import { BlogPostsTable } from "@/components/blog-posts-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
      url: `/blog/category/${category}`,
      siteName: "BrandScout",
      type: "website",
      images: [{ url: "/og-image.png", width: 1424, height: 752, alt: `${cat.label} Articles | BrandScout` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.label} Articles | BrandScout`,
      description: cat.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const posts = await getPostsByCategoryAsync(category);
  const tablePosts = toBlogTablePosts(posts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: cat.label },
        ]} />
        <div className="mb-8">
          <p className="mb-3 text-sm font-medium text-gray-500">Category</p>
          <h1 className="text-3xl font-semibold text-gray-900">{cat.label}</h1>
          <p className="mt-3 max-w-2xl text-gray-500">{cat.description}</p>
        </div>
        {tablePosts.length > 0 ? (
          <BlogPostsTable posts={tablePosts} />
        ) : (
          <p className="text-gray-500 text-center py-12">No posts in this category yet.</p>
        )}
      </div>
    </div>
  );
}
