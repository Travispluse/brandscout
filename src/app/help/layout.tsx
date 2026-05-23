import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Help Center",
  description:
    "Find answers about BrandScout searches, brand scores, domain availability, username checks, API usage, privacy, and troubleshooting.",
  path: "/help",
});

export default function HelpLayout({ children }: { children: ReactNode }) {
  return children;
}
