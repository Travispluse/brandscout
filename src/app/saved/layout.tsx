import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Saved Searches",
  description: "Review saved BrandScout searches and watchlist items stored locally in your browser.",
  path: "/saved",
  index: false,
});

export default function SavedLayout({ children }: { children: ReactNode }) {
  return children;
}
