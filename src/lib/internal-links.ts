const LINK_MAP: Record<string, string> = {
  "domain availability": "/",
  "brand name checker": "/",
  "username availability": "/",
  "brand naming": "/blog/category/brand-naming",
  "domain strategy": "/blog/category/domain-strategy",
  "social handles": "/blog/category/social-handles",
  "social media handles": "/blog/category/social-handles",
  "trademark": "/blog/category/business-legal",
  "branding strategy": "/blog/category/branding-strategy",
  "brand identity": "/glossary#brand-identity",
  "brand equity": "/glossary#brand-equity",
  "SEO": "/glossary#seo",
  "WHOIS": "/glossary#whois",
  "RDAP": "/glossary#rdap",
  "DNS": "/glossary#dns",
  "TLD": "/glossary#tld",
  "API documentation": "/docs",
  "API": "/docs",
  "templates": "/templates",
  "glossary": "/glossary",
  "help center": "/help",
  "brand guidelines": "/glossary#brand-guidelines",
  "domain hack": "/glossary#domain-hack",
  "exact match domain": "/glossary#exact-match-domain",
  "premium domain": "/glossary#premium-domain",
  "ccTLD": "/glossary#cctld",
  "gTLD": "/glossary#gtld",
  "name generator": "/",
  "bulk check": "/",
};

/**
 * Auto-link relevant terms in text content.
 * Returns text with up to maxLinks terms wrapped in markdown links.
 */
export function applyInternalLinks(text: string, maxLinks = 5): string {
  let count = 0;
  const usedUrls = new Set<string>();
  let result = text;

  // Sort by length descending to match longer phrases first
  const sorted = Object.entries(LINK_MAP).sort((a, b) => b[0].length - a[0].length);

  for (const [keyword, url] of sorted) {
    if (count >= maxLinks) break;
    if (usedUrls.has(url)) continue;

    // Only match if not already inside a markdown link
    const regex = new RegExp(`(?<!\\[)\\b(${keyword})\\b(?![^\\[]*\\])`, "i");
    const match = result.match(regex);
    if (match) {
      result = result.replace(regex, `[$1](${url})`);
      count++;
      usedUrls.add(url);
    }
  }

  return result;
}
