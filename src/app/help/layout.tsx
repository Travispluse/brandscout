import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers about BrandScout searches, domain and username results, API usage, privacy, and troubleshooting.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Help Center | BrandScout",
    description: "Find answers about BrandScout searches, results, API usage, privacy, and troubleshooting.",
    url: "/help",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center | BrandScout",
    description: "Find answers about using BrandScout.",
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
