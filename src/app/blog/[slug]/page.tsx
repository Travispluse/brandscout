import { getPost, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TableOfContents } from "@/components/table-of-contents";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { AuthorProfile } from "@/components/author-profile";

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
    openGraph: {
      title: `${post.title} | BrandScout`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      siteName: "BrandScout",
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | BrandScout`,
      description: post.excerpt,
    },
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
    url: `https://brandscout.net/blog/${slug}`,
    author: { "@type": "Organization", name: "BrandScout Team", url: "https://brandscout.net" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <div className="max-w-2xl">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]} />
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <article className="max-w-2xl flex-1 min-w-0">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">{post.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {post.date} · {readingTime(post.content)} min read
            </p>
          </header>
          <TableOfContents content={post.content} mode="mobile" />
          <div className="prose prose-neutral max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_ol]:mb-4 [&_ol]:pl-5 [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20">
            <MDXRemote source={post.content} />
          </div>
          <hr className="my-8 border-border" />
          <AuthorProfile />
          <hr className="my-8 border-border" />
          <NewsletterSignup />
          <hr className="my-8 border-border" />
          <p className="text-sm text-muted-foreground">
            Ready to check your brand name?{" "}
            <Link href="/" className="underline hover:text-foreground">Try BrandScout →</Link>
          </p>
        </article>
        <TableOfContents content={post.content} mode="desktop" />
      </div>
    </div>
  );
}
