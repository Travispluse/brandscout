import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Brand Name Checker",
  description: "Upload or generate multiple brand name ideas and check domain and username availability in batches.",
  alternates: { canonical: "/bulk" },
  openGraph: {
    title: "Bulk Brand Name Checker | BrandScout",
    description: "Check multiple brand names for domain and username availability in batches.",
    url: "/bulk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Brand Name Checker | BrandScout",
    description: "Check multiple brand names in batches.",
  },
};

export default function BulkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
