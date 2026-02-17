import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const registrars = [
  {
    name: "Namecheap",
    url: "https://www.namecheap.com",
    pros: ["Low prices", "Free WhoisGuard privacy", "Great UI", "Good support"],
    cons: ["Renewal prices can increase", "Upsells during checkout"],
    priceRange: "$6-12/yr for .com",
  },
  {
    name: "GoDaddy",
    url: "https://www.godaddy.com",
    pros: ["Largest registrar", "Frequent sales", "Phone support", "Wide TLD selection"],
    cons: ["Higher renewal prices", "Aggressive upselling", "Privacy costs extra"],
    priceRange: "$12-20/yr for .com",
  },
  {
    name: "Porkbun",
    url: "https://porkbun.com",
    pros: ["Cheapest prices", "Free WHOIS privacy", "Clean interface", "Free SSL"],
    cons: ["Smaller company", "Fewer advanced features"],
    priceRange: "$5-10/yr for .com",
  },
  {
    name: "Google Domains (Squarespace)",
    url: "https://domains.squarespace.com",
    pros: ["Simple pricing", "No upsells", "Free privacy", "Google integration"],
    cons: ["Transferred to Squarespace", "Limited TLDs", "No bulk discounts"],
    priceRange: "$12-14/yr for .com",
  },
  {
    name: "Cloudflare Registrar",
    url: "https://www.cloudflare.com/products/registrar/",
    pros: ["At-cost pricing", "Free privacy", "Integrated CDN/security", "No markup"],
    cons: ["Must use Cloudflare DNS", "No fancy UI", "Limited TLDs"],
    priceRange: "$8-10/yr for .com",
  },
];

export default function RegistrarsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Domain Registrar Comparison</h1>
      <p className="text-muted-foreground mb-8">Compare the best domain registrars to find the right fit for your brand.</p>

      <div className="space-y-6">
        {registrars.map((r) => (
          <Card key={r.name} className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{r.name}</CardTitle>
                <span className="text-sm text-muted-foreground">{r.priceRange}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-success mb-2">✓ Pros</h3>
                  <ul className="text-sm space-y-1">
                    {r.pros.map((p) => <li key={p} className="text-muted-foreground">• {p}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-destructive mb-2">✗ Cons</h3>
                  <ul className="text-sm space-y-1">
                    {r.cons.map((c) => <li key={c} className="text-muted-foreground">• {c}</li>)}
                  </ul>
                </div>
              </div>
              <a href={r.url} target="_blank" rel="noopener" className="inline-block mt-4 text-sm text-primary hover:underline">
                Visit {r.name} →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
