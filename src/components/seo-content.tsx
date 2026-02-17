import Link from "next/link";

const faqs = [
  {
    q: "Is BrandScout really free?",
    a: "Yes — BrandScout is 100% free with no signup required. Search as many brand names as you like.",
  },
  {
    q: "Which domains does BrandScout check?",
    a: "We check .com, .io, .ai, .co, .dev, .app, and other popular TLDs using real-time DNS and WHOIS lookups.",
  },
  {
    q: "Which social media platforms are checked?",
    a: "We check username availability on Twitter/X, Instagram, GitHub, TikTok, YouTube, and more.",
  },
  {
    q: "How accurate are the results?",
    a: "Domain results are highly accurate via DNS/WHOIS. Some social platforms restrict automated checks, so those may show as 'Unknown' and need manual verification.",
  },
  {
    q: "Can I register a domain directly from BrandScout?",
    a: "We link you directly to Namecheap where you can register available domains in seconds.",
  },
  {
    q: "How do I pick a good brand name?",
    a: "Keep it short, memorable, and easy to spell. Check that the .com domain and key social handles are available. Read our guide on choosing a brand name for more tips.",
  },
];

export function SeoContent() {
  return (
    <section className="max-w-2xl mx-auto px-4 mt-20 mb-8 space-y-14 text-sm leading-relaxed">
      {/* What is BrandScout */}
      <div>
        <h2 className="text-2xl font-bold mb-3">Free Brand Name Availability Checker</h2>
        <p className="text-muted-foreground">
          BrandScout lets you instantly check whether a brand name is available as a domain and across
          major social media platforms — all in one search. No signup, no limits, completely free.
        </p>
      </div>

      {/* How It Works */}
      <div>
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="space-y-4 list-none pl-0">
          {[
            { step: "1", title: "Enter a brand name", desc: "Type any word, phrase, or company name you're considering." },
            { step: "2", title: "Get instant results", desc: "We check domains (.com, .io, .ai…) and social usernames in seconds." },
            { step: "3", title: "Register what's available", desc: "Grab your domain and usernames before someone else does." },
          ].map((item) => (
            <li key={item.step} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                {item.step}
              </span>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="font-semibold">{faq.q}</dt>
              <dd className="text-muted-foreground mt-1">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Internal links */}
      <div className="text-muted-foreground space-y-1">
        <p>Learn more on our blog:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <Link href="/blog/choosing-a-brand-name" className="underline hover:text-foreground">
              How to Choose the Perfect Brand Name in 2026
            </Link>
          </li>
          <li>
            <Link href="/blog/domain-extensions-guide" className="underline hover:text-foreground">
              Domain Extensions Explained: .com vs .io vs .ai
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

/** JSON-LD structured data for the homepage */
export function HomeJsonLd() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BrandScout",
    url: "https://brandscout.app",
    description: "Free brand name availability checker for domains and social media usernames.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
