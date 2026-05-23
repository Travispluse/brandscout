import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Brand Name Generator",
  description: "Generate brand name ideas, taglines, and niche concepts, then check availability across domains and social handles.",
  alternates: { canonical: "/ai-generator" },
  openGraph: {
    title: "AI Brand Name Generator | BrandScout",
    description: "Generate brand name ideas, taglines, and niche concepts, then check availability.",
    url: "/ai-generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Brand Name Generator | BrandScout",
    description: "Generate brand names and check availability.",
  },
};

export default function AIGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
