import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "AI Brand Name Generator",
  description:
    "Generate brand names, taglines, and niche ideas from keywords, industry, and vibe before checking domain and social handle availability.",
  path: "/ai-generator",
});

export default function AIGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}
