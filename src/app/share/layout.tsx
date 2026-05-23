import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Shared BrandScout Results",
  description: "View a read-only BrandScout availability result shared from another browser.",
  path: "/share",
  index: false,
});

export default function ShareLayout({ children }: { children: ReactNode }) {
  return children;
}
