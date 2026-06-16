import { getPostAsync, getLocalPostsAsync, type BlogPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TableOfContents } from "@/components/table-of-contents";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { AuthorProfile } from "@/components/author-profile";

export const revalidate = 60; // ISR: revalidate every 60 seconds
export const dynamicParams = true; // Allow dynamic slugs not in generateStaticParams

type Params = Promise<{ slug: string }>;

const siteUrl = "https://brandscout.net";
const siteName = "BrandScout";
const titleSuffix = ` | ${siteName}`;
const maxTitleLength = 60;
const defaultBlogImage = "/og-image.png";

function toAbsoluteUrl(url?: string) {
  try {
    return new URL(url || defaultBlogImage, siteUrl).toString();
  } catch {
    return new URL(defaultBlogImage, siteUrl).toString();
  }
}

function truncateTitle(title: string) {
  if (`${title}${titleSuffix}`.length <= maxTitleLength) return title;

  const maxBaseLength = maxTitleLength - titleSuffix.length;
  return `${title.slice(0, maxBaseLength - 3).trimEnd()}...`;
}

function stripMarkdown(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*[\]()>`_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getPostDescription(post: BlogPost) {
  const description =
    post.excerpt ||
    stripMarkdown(post.content) ||
    `Read about ${post.title} on ${siteName}.`;

  if (description.length <= 160) return description;
  return `${description.slice(0, 157).trimEnd()}...`;
}

export async function generateStaticParams() {
  // Pre-render checked-in MDX posts. Remote API posts remain available on-demand.
  const posts = await getLocalPostsAsync();
  return posts.slice(0, 50).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostAsync(slug);
  if (!post) return { title: "Not Found" };
  
  const description = getPostDescription(post);
  const pageTitle = truncateTitle(post.title);
  const imageUrl = toAbsoluteUrl(post.image_url);
  
  return {
    title: pageTitle,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${pageTitle} | BrandScout`,
      description,
      type: "article",
      publishedTime: post.date,
      siteName,
      url: `${siteUrl}/blog/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle}${titleSuffix}`,
      description,
      images: [imageUrl],
    },
  };
}

function readingTime(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 230));
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostAsync(slug);
  if (!post) notFound();

  const description = getPostDescription(post);
  const imageUrl = toAbsoluteUrl(post.image_url);
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description,
    image: imageUrl,
    url: `${siteUrl}/blog/${slug}`,
    author: { "@type": "Organization", name: "BrandScout Team", url: siteUrl },
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${post.image_url || "/brandscout-hero.svg"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/86 to-gray-950/30" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <Link href="/blog" className="text-sm font-medium text-cyan-200 hover:text-white">
            Blog
          </Link>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-gray-300">
            {post.date} · {readingTime(post.content)} min read
          </p>
          {post.excerpt && (
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200">{post.excerpt}</p>
          )}
        </div>
      </section>
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <div className="max-w-2xl">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]} />
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <article className="w-full max-w-2xl flex-1 min-w-0">
          <TableOfContents content={post.content} mode="mobile" />
          <div className="prose prose-neutral max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_ol]:mb-4 [&_ol]:pl-5 [&_code]:break-words [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20">
            <MDXRemote source={post.content} components={{
              // Remap H1 in blog content to H2 (page already has an H1)
              h1: (props: React.ComponentProps<"h2">) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
            }} />
          </div>
          <hr className="my-8 border-gray-200" />
          <AuthorProfile />
          <hr className="my-8 border-gray-200" />
          <NewsletterSignup />
          <hr className="my-8 border-gray-200" />
          <p className="text-sm text-gray-500">
            Ready to check your brand name?{" "}
            <Link href="/" className="underline hover:text-gray-900">Try BrandScout →</Link>
          </p>
        </article>
        <TableOfContents content={post.content} mode="desktop" />
      </div>
    </div>
    </div>
  );
}
