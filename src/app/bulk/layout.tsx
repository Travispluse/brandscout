import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Bulk Brand Name Checker",
  description:
    "Upload or generate a list of brand names and check domain plus social username availability for multiple ideas at once.",
  path: "/bulk",
});

export default function BulkLayout({ children }: { children: ReactNode }) {
  return children;
}
