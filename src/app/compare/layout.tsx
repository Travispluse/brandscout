import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A/B Brand Name Tester",
  description: "Compare 2 to 5 brand name options side by side using availability scores, domain status, and username coverage.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "A/B Brand Name Tester | BrandScout",
    description: "Compare brand name options side by side using domain and username availability signals.",
    url: "/compare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A/B Brand Name Tester | BrandScout",
    description: "Compare brand name options side by side.",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
