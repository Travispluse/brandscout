import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "BrandScout's editorial policy covering accuracy, corrections, sources, and AI disclosure.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Editorial Policy</h1>

      <div className="prose prose-neutral max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">Our Commitment to Accuracy</h2>
          <p className="text-muted-foreground">BrandScout is committed to providing accurate, up-to-date, and useful information about brand naming, domain availability, and digital identity. Our content is researched, written, and reviewed to ensure it meets high standards of quality and reliability.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Content Standards</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong>Factual accuracy:</strong> All claims are verified against authoritative sources including ICANN, domain registrar documentation, and platform APIs.</li>
            <li><strong>Timeliness:</strong> We regularly review and update content to reflect changes in domain policies, platform availability, and industry best practices.</li>
            <li><strong>Objectivity:</strong> Our tool results reflect real-time data from public APIs. We do not manipulate availability results or favor specific registrars.</li>
            <li><strong>Transparency:</strong> When information is estimated or approximate (such as brand scores), we clearly explain the methodology.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Sources</h2>
          <p className="text-muted-foreground">Our data comes from publicly available sources including DNS lookups, RDAP/WHOIS databases, and platform-specific APIs. Blog content references industry publications, official documentation, and expert knowledge. We cite sources where applicable.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">AI Disclosure</h2>
          <p className="text-muted-foreground">Some content on BrandScout may be created or assisted by artificial intelligence tools. All AI-generated content is reviewed by the BrandScout team for accuracy, relevance, and quality before publication. AI-assisted content is held to the same editorial standards as human-written content.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Corrections Policy</h2>
          <p className="text-muted-foreground">We take errors seriously. If you find inaccurate information on BrandScout:</p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>We will investigate and correct verified errors promptly.</li>
            <li>Significant corrections will be noted at the bottom of the affected content.</li>
            <li>We maintain a commitment to transparency about our mistakes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Affiliate & Commercial Relationships</h2>
          <p className="text-muted-foreground">BrandScout may contain links to domain registrars or related services. Any commercial relationships are disclosed. Our tool results and editorial content are never influenced by commercial partnerships.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Independence</h2>
          <p className="text-muted-foreground">Our editorial decisions are made independently. No external party has influence over our content, tool functionality, or recommendations. We serve our users first.</p>
        </section>

        <p className="text-muted-foreground text-xs mt-8">Last updated: February 2026</p>
      </div>
    </div>
  );
}
