import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Achievements",
  description: "Track BrandScout achievements and search streaks stored locally in your browser.",
  path: "/achievements",
  index: false,
});

export default function AchievementsLayout({ children }: { children: ReactNode }) {
  return children;
}
