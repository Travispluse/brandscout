import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Settings",
  description: "View, export, or delete BrandScout data stored locally in this browser.",
  alternates: { canonical: "/privacy-settings" },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function PrivacySettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
