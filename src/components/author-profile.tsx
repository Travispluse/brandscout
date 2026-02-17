export function AuthorProfile() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BrandScout Team",
    url: "https://brandscout.net",
    logo: "https://brandscout.net/icon.svg",
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-xl shrink-0">
        🔍
      </div>
      <div>
        <p className="font-semibold text-sm">BrandScout Team</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          The BrandScout team researches and writes about brand naming, domain strategy, and digital identity. 
          Our goal is to help entrepreneurs and businesses find the perfect name and secure their online presence.
        </p>
      </div>
    </div>
  );
}
