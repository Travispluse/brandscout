import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BrandScout Privacy Policy — how we handle your data when you use our free brand name availability checker.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-neutral dark:prose-invert">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-8">Last updated: February 2026</p>

      <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong>Search Queries:</strong> When you search for a brand name, we may store the query and results to improve the Service and provide analytics. No personal information is required to use BrandScout.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-2">
        <strong>Local Storage:</strong> We store your recent search history in your browser&apos;s local storage for your convenience. This data never leaves your device.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-2">
        <strong>Usage Data:</strong> We may collect anonymous usage data such as page views, search frequency, and browser type to improve the Service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
      <ul className="text-muted-foreground space-y-2">
        <li>To provide and improve the brand name checking service</li>
        <li>To analyze usage patterns and improve user experience</li>
        <li>To detect and prevent abuse of the Service</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Sharing</h2>
      <p className="text-muted-foreground leading-relaxed">
        We do not sell, rent, or share your personal information with third parties. Search queries are sent to third-party platforms (domain registrars, social media sites) solely to check availability on your behalf.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Cookies</h2>
      <p className="text-muted-foreground leading-relaxed">
        BrandScout uses minimal cookies for theme preferences (light/dark mode). We do not use tracking cookies or third-party advertising cookies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Retention</h2>
      <p className="text-muted-foreground leading-relaxed">
        Search history stored in local storage persists until you clear it. Server-side search logs are retained for up to 90 days for service improvement purposes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Rights</h2>
      <p className="text-muted-foreground leading-relaxed">
        You can clear your local search history at any time using the &ldquo;Clear&rdquo; button in the search dropdown. For any data deletion requests, contact us at support@brandscout.net.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes to This Policy</h2>
      <p className="text-muted-foreground leading-relaxed">
        We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the &ldquo;Last updated&rdquo; date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact</h2>
      <p className="text-muted-foreground leading-relaxed">
        For privacy-related questions, please contact us at support@brandscout.net.
      </p>
    </div>
  );
}
