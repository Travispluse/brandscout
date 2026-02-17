import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "BrandScout Terms of Service — rules and guidelines for using our free brand name availability checker.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-neutral dark:prose-invert">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
      <h1 className="text-3xl font-bold tracking-tight mb-8">Terms of Service</h1>
      <p className="text-muted-foreground text-sm mb-8">Last updated: February 2026</p>

      <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
      <p className="text-muted-foreground leading-relaxed">
        By accessing and using BrandScout (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
      <p className="text-muted-foreground leading-relaxed">
        BrandScout provides a free tool to check domain name and social media username availability. Results are provided on an &ldquo;as-is&rdquo; basis and may not always be accurate or up-to-date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Accuracy of Results</h2>
      <p className="text-muted-foreground leading-relaxed">
        We make reasonable efforts to provide accurate availability information, but we cannot guarantee the accuracy, completeness, or timeliness of any results. Domain and username availability can change at any time. Always verify availability directly with the registrar or platform before making purchasing decisions.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Acceptable Use</h2>
      <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
      <ul className="text-muted-foreground space-y-2 mt-2">
        <li>Use automated tools to make excessive requests to the Service</li>
        <li>Attempt to circumvent any rate limiting or security measures</li>
        <li>Use the Service for any illegal or unauthorized purpose</li>
        <li>Resell or redistribute data obtained from the Service without permission</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">5. Affiliate Links</h2>
      <p className="text-muted-foreground leading-relaxed">
        The Service may contain affiliate links to domain registrars and other services. We may earn a commission when you make a purchase through these links at no additional cost to you.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
      <p className="text-muted-foreground leading-relaxed">
        BrandScout is provided &ldquo;as is&rdquo; without warranties of any kind. We shall not be liable for any damages arising from your use of the Service, including but not limited to lost profits, data loss, or business interruption.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
      <p className="text-muted-foreground leading-relaxed">
        We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the modified terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact</h2>
      <p className="text-muted-foreground leading-relaxed">
        For questions about these Terms, please contact us at support@brandscout.net.
      </p>
    </div>
  );
}
