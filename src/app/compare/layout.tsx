import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "A/B Name Tester",
  description:
    "Compare two to five brand name candidates side by side using domain availability, username availability, and BrandScout scores.",
  path: "/compare",
});

export default function CompareLayout({ children }: { children: ReactNode }) {
  return children;
}
