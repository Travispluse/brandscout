import { getAllPostsAsync, CATEGORIES } from "@/lib/blog";
import { toBlogTablePosts } from "@/lib/blog-table-posts";
import { BlogPostsTable } from "@/components/blog-posts-table";
import Link from "next/link";
import Image from "next/image";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: "Blog | Brand Naming Tips & Domain Strategy",
  description: "Expert tips and guides on choosing the perfect brand name, domain strategy, and securing your online presence across platforms.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getAllPostsAsync();
  const tablePosts = toBlogTablePosts(posts);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <Image
          src="/brandscout-hero.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/20" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium text-cyan-200">BrandScout Library</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">Naming, domains, and launch details without the fluff.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-200">
              Practical guides for choosing a name, checking availability, and getting a brand ready for public launch.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 flex-nowrap sm:flex-wrap">
          {Object.entries(CATEGORIES).map(([slug, cat]) => (
            <Link
              key={slug}
              href={`/blog/category/${slug}`}
              className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {tablePosts.length > 0 ? (
          <BlogPostsTable posts={tablePosts} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
