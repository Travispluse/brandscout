import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Searches",
  description: "Review BrandScout searches saved locally in this browser.",
  alternates: { canonical: "/saved" },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
