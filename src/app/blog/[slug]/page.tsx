import { getPost, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date },
  };
}

function readingTime(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 230));
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
    url: `https://brandscout.app/blog/${slug}`,
    author: { "@type": "Organization", name: "BrandScout" },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {post.date} · {readingTime(post.content)} min read
          </p>
        </header>
        <div className="prose prose-neutral max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_ol]:mb-4 [&_ol]:pl-5">
          <MDXRemote source={post.content} />
        </div>
        <hr className="my-8 border-border" />
        <p className="text-sm text-muted-foreground">
          Ready to check your brand name?{" "}
          <Link href="/" className="underline hover:text-foreground">Try BrandScout →</Link>
        </p>
      </article>
    </div>
  );
}
