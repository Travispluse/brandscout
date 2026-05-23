import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared BrandScout Results",
  description: "View a read-only BrandScout availability report shared by another user.",
  alternates: { canonical: "/share" },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
