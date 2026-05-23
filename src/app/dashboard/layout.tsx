import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage BrandScout browser-local usage stats, API keys, and export branding settings.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
