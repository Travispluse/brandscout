import { NewsletterSignup } from "@/components/newsletter-signup";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Newsletter | Brand Naming Tips",
  description: "Subscribe to BrandScout's newsletter for expert brand naming tips, domain strategy, and social media handle advice.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Newsletter" }]} />
      <h1 className="text-3xl font-bold mb-4">Newsletter</h1>
      <p className="text-gray-500 mb-8">
        Get the latest brand naming tips, domain strategies, and social media insights delivered to your inbox.
      </p>
      <NewsletterSignup />
    </div>
  );
}
