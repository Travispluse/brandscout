import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Settings",
  description: "View, export, or delete BrandScout data stored locally in your browser.",
  path: "/privacy-settings",
  index: false,
});

export default function PrivacySettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
