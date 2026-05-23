import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements",
  description: "View BrandScout achievements unlocked in this browser.",
  alternates: { canonical: "/achievements" },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
