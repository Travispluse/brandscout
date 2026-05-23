import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branding Templates",
  description: "Download brand naming worksheets, domain strategy checklists, social handle trackers, and launch planning templates.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "Branding Templates | BrandScout",
    description: "Download worksheets, checklists, trackers, and templates for planning a brand launch.",
    url: "/templates",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Branding Templates | BrandScout",
    description: "Download practical brand planning templates.",
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
