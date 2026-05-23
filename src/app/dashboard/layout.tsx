import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard",
  description:
    "View BrandScout usage stats, API key, and export branding settings stored locally in your browser.",
  path: "/dashboard",
  index: false,
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
