import { Breadcrumbs } from "@/components/breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Accessibility Statement",
  description: "BrandScout's commitment to an accessible website and how to report an accessibility problem.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  const p = "text-gray-600 leading-relaxed";
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-neutral">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Accessibility" }]} />
      <h1 className="text-3xl font-bold tracking-tight mb-8">Accessibility Statement</h1>
      <p className="text-gray-600 text-sm mb-8">Last reviewed: November 4, 2026</p>
      <p className={p}>
        We want everyone to be able to use BrandScout, including people who use screen readers, keyboard navigation,
        magnification or other assistive technology. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1
        Level AA and review the site as we add features.
      </p>
      <p className={`${p} mt-4`}>
        If something on the site is hard to use, or you need information in another format, email{" "}
        <a href="mailto:support@brandscout.net" className="underline">support@brandscout.net</a> with the page address and
        a short description of the problem. We will do our best to help and to fix the issue.
      </p>
    </div>
  );
}
