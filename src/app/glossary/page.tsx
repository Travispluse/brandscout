import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branding Glossary — 50+ Terms Defined",
  description: "Comprehensive glossary of branding, domain, DNS, SEO, and social media terms. Learn key concepts for building your brand online.",
  alternates: { canonical: "/glossary" },
};

interface Term { id: string; term: string; definition: string; }

const terms: Term[] = [
  { id: "a-record", term: "A Record", definition: "A DNS record that maps a domain name to an IPv4 address, directing web traffic to the correct server." },
  { id: "aftermarket", term: "Aftermarket", definition: "The secondary market where previously registered domain names are bought and sold, often at premium prices." },
  { id: "backorder", term: "Backorder", definition: "A service that attempts to register a domain name on your behalf the moment it becomes available after expiration." },
  { id: "brand-architecture", term: "Brand Architecture", definition: "The organizational structure of a company's brands, sub-brands, and products, defining how they relate to each other." },
  { id: "brand-equity", term: "Brand Equity", definition: "The commercial value derived from consumer perception of a brand name, built through awareness, loyalty, and associations." },
  { id: "brand-guidelines", term: "Brand Guidelines", definition: "A document that defines the rules for how a brand is presented visually and verbally, ensuring consistency across all touchpoints." },
  { id: "brand-identity", term: "Brand Identity", definition: "The collection of visual and verbal elements that represent a brand, including logo, colors, typography, voice, and messaging." },
  { id: "brand-positioning", term: "Brand Positioning", definition: "The strategic process of establishing a distinct place for your brand in the minds of your target audience relative to competitors." },
  { id: "brand-voice", term: "Brand Voice", definition: "The consistent personality and tone expressed through a brand's communications, reflecting its values and character." },
  { id: "canonical", term: "Canonical URL", definition: "An HTML element that tells search engines which URL is the preferred version of a page, preventing duplicate content issues." },
  { id: "cctld", term: "ccTLD", definition: "Country Code Top-Level Domain — a two-letter domain extension assigned to a specific country, like .uk, .de, or .jp." },
  { id: "cdn", term: "CDN", definition: "Content Delivery Network — a geographically distributed network of servers that delivers web content faster by serving it from the nearest location." },
  { id: "cname", term: "CNAME", definition: "Canonical Name record — a DNS record that maps an alias domain name to the true (canonical) domain name." },
  { id: "color-palette", term: "Color Palette", definition: "The defined set of colors used consistently across all brand materials, typically including primary, secondary, and accent colors." },
  { id: "dba", term: "DBA", definition: "\"Doing Business As\" — a registration that allows a business to operate under a name different from its legal entity name." },
  { id: "dns", term: "DNS", definition: "Domain Name System — the internet's phone book that translates human-readable domain names into IP addresses computers use to communicate." },
  { id: "domain-forwarding", term: "Domain Forwarding", definition: "Automatically redirecting visitors from one domain to another, useful for alternative spellings or legacy domains." },
  { id: "domain-hack", term: "Domain Hack", definition: "A creative use of a domain extension as part of the brand name, like del.icio.us or bit.ly, where the TLD completes the word." },
  { id: "domain-parking", term: "Domain Parking", definition: "Registering a domain without connecting it to a website, often displaying ads or a placeholder page to generate revenue." },
  { id: "exact-match-domain", term: "Exact Match Domain", definition: "A domain that exactly matches a search query (e.g., cheapflights.com), historically valued for SEO though less impactful today." },
  { id: "favicon", term: "Favicon", definition: "A small icon (typically 16×16 or 32×32 pixels) displayed in browser tabs, bookmarks, and address bars to identify a website." },
  { id: "gtld", term: "gTLD", definition: "Generic Top-Level Domain — domain extensions not tied to a country, like .com, .org, .net, and newer ones like .app, .io, .ai." },
  { id: "handle", term: "Handle", definition: "A username or screen name used to identify a user on social media platforms, typically prefixed with @ (e.g., @brandscout)." },
  { id: "logo-mark", term: "Logo Mark", definition: "The icon or symbol portion of a logo that can stand alone without text, like Apple's apple or Nike's swoosh." },
  { id: "meta-tag", term: "Meta Tag", definition: "HTML elements in a page's head section that provide metadata about the page to search engines and social platforms." },
  { id: "monogram", term: "Monogram", definition: "A logo design consisting of intertwined or combined initials or letters, like IBM or HBO." },
  { id: "mx-record", term: "MX Record", definition: "Mail Exchange record — a DNS record that specifies the mail server responsible for receiving email for a domain." },
  { id: "nameserver", term: "Nameserver", definition: "A server that stores DNS records and responds to queries about domain names, translating them to IP addresses." },
  { id: "og-tag", term: "OG Tag", definition: "Open Graph tag — HTML meta tags that control how content appears when shared on social media platforms like Facebook and LinkedIn." },
  { id: "premium-domain", term: "Premium Domain", definition: "A domain name valued higher than standard registration price due to its length, keywords, brandability, or existing traffic." },
  { id: "rdap", term: "RDAP", definition: "Registration Data Access Protocol — the modern replacement for WHOIS that provides domain registration data in a structured, standardized format." },
  { id: "registrant", term: "Registrant", definition: "The person or organization that has registered a domain name and holds the rights to use it." },
  { id: "registrar", term: "Registrar", definition: "An accredited organization authorized to register domain names on behalf of customers (e.g., GoDaddy, Namecheap, Cloudflare)." },
  { id: "schema-markup", term: "Schema Markup", definition: "Structured data added to HTML that helps search engines understand page content and display rich results in search listings." },
  { id: "seo", term: "SEO", definition: "Search Engine Optimization — the practice of improving a website's visibility in organic search results through content, technical, and off-page strategies." },
  { id: "serp", term: "SERP", definition: "Search Engine Results Page — the page displayed by a search engine in response to a query, containing organic and paid results." },
  { id: "service-mark", term: "Service Mark", definition: "Similar to a trademark but specifically protects the name or logo of a service rather than a physical product." },
  { id: "slogan", term: "Slogan", definition: "A memorable phrase used in advertising campaigns that may change over time, as opposed to a tagline which is more permanent." },
  { id: "ssl", term: "SSL", definition: "Secure Sockets Layer — a security protocol that encrypts data between a web server and browser, indicated by HTTPS and the padlock icon." },
  { id: "style-guide", term: "Style Guide", definition: "A comprehensive document defining the visual and editorial standards for a brand, including design specs, writing tone, and usage rules." },
  { id: "subdomain", term: "Subdomain", definition: "A prefix added to a domain name to organize or separate sections of a website (e.g., blog.example.com or shop.example.com)." },
  { id: "tagline", term: "Tagline", definition: "A short, memorable phrase that captures the essence of a brand's identity or promise, used consistently over time." },
  { id: "tld", term: "TLD", definition: "Top-Level Domain — the last segment of a domain name after the final dot, such as .com, .org, .net, or .io." },
  { id: "tone", term: "Tone", definition: "The emotional inflection applied to a brand's voice depending on context — formal in legal pages, friendly in social media, urgent in promotions." },
  { id: "trademark", term: "Trademark", definition: "A legally registered word, phrase, symbol, or design that identifies and distinguishes the products of one company from others." },
  { id: "typography", term: "Typography", definition: "The art and technique of selecting and arranging typefaces as part of a brand's visual identity, affecting readability and personality." },
  { id: "username", term: "Username", definition: "A unique identifier chosen by a user to represent themselves on a platform, critical for brand consistency across the web." },
  { id: "value-proposition", term: "Value Proposition", definition: "A clear statement explaining how a product or brand solves a problem, delivers benefits, and why customers should choose it over alternatives." },
  { id: "whois", term: "WHOIS", definition: "A protocol and database used to look up registration information for domain names, including registrant, registrar, and expiration dates." },
  { id: "wildcard-dns", term: "Wildcard DNS", definition: "A DNS record using an asterisk (*) that matches requests for non-existent subdomains, routing all unmatched traffic to a specified destination." },
  { id: "wordmark", term: "Wordmark", definition: "A logo design that consists entirely of the brand's name in a distinctive typeface, like Google, Coca-Cola, or FedEx." },
];

export default function GlossaryPage() {
  const letters = [...new Set(terms.map(t => t.term[0].toUpperCase()))].sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Branding Glossary",
    description: "Comprehensive glossary of branding, domain, and digital identity terms.",
    url: "https://brandscout.net/glossary",
    hasDefinedTerm: terms.map(t => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      url: `https://brandscout.net/glossary#${t.id}`,
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-bold mb-2">Branding Glossary</h1>
      <p className="text-muted-foreground mb-6">50+ essential terms for branding, domains, DNS, SEO, and social media — explained simply.</p>

      {/* Letter Navigation */}
      <nav className="flex flex-wrap gap-1 mb-8">
        {letters.map(l => (
          <a key={l} href={`#letter-${l}`} className="px-2 py-1 text-sm rounded hover:bg-surface transition-colors font-medium">{l}</a>
        ))}
      </nav>

      {/* Terms */}
      {letters.map(letter => {
        const group = terms.filter(t => t.term[0].toUpperCase() === letter);
        return (
          <section key={letter} id={`letter-${letter}`} className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-foreground/70">{letter}</h2>
            <div className="space-y-4">
              {group.map(t => (
                <div key={t.id} id={t.id} className="scroll-mt-20">
                  <h3 className="font-semibold">{t.term}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.definition}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
