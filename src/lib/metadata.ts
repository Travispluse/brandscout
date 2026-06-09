import type { Metadata } from "next";

const siteName = "BrandScout";
const ogImage = "/og-image.png";
const ogImageWidth = 1424;
const ogImageHeight = 752;

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName,
      type: "website",
      images: [{ url: ogImage, width: ogImageWidth, height: ogImageHeight, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}
