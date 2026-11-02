import type { Metadata } from "next";

export const siteName = "BrandScout";
export const siteUrl = "https://brandscout.net";
export const defaultOgImage = "/og-image.png";
export const defaultOgImageWidth = 1424;
export const defaultOgImageHeight = 752;

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}

export function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
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
      images: [
        {
          url: defaultOgImage,
          width: defaultOgImageWidth,
          height: defaultOgImageHeight,
          alt: socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: defaultOgImage, alt: socialTitle }],
    },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}
