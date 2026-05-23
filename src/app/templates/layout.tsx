import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Branding Templates",
  description:
    "Download practical templates for brand naming, domain strategy, social handle tracking, launch planning, and competitor analysis.",
  path: "/templates",
});

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return children;
}
