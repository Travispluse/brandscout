"use client";

import { useState, useCallback } from "react";
import type { Metadata } from "next";

interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  format: string;
  content: string;
}

const templates: Template[] = [
  {
    id: "brand-naming",
    title: "Brand Naming Worksheet",
    description: "Structured worksheet to brainstorm, evaluate, and shortlist brand name ideas with scoring criteria.",
    icon: "📝",
    format: "MD",
    content: `# Brand Naming Worksheet

## 1. Brand Foundation
- **Industry/Niche:** _______________
- **Target Audience:** _______________
- **Brand Personality (3 adjectives):** _______________, _______________, _______________
- **Core Value Proposition:** _______________

## 2. Name Brainstorm
| # | Name Idea | Type (Real/Invented/Compound) | Feeling/Tone |
|---|-----------|-------------------------------|--------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |
| 10| | | |

## 3. Evaluation Criteria (Score 1-5)
| Name | Memorable | Pronounceable | Spellable | Unique | Domain Available | Total |
|------|-----------|---------------|-----------|--------|-----------------|-------|
| | | | | | | |
| | | | | | | |
| | | | | | | |

## 4. Linguistic Check
- [ ] Easy to pronounce in target languages
- [ ] No negative meanings in other languages
- [ ] No unintended abbreviations
- [ ] Works as a hashtag
- [ ] Passes the "phone test" (easy to say over phone)

## 5. Top 3 Finalists
1. **_______________** — Why: _______________
2. **_______________** — Why: _______________
3. **_______________** — Why: _______________

## 6. Next Steps
- [ ] Check domain availability on [BrandScout](https://brandscout.net)
- [ ] Check social media handles
- [ ] Search USPTO trademark database
- [ ] Get feedback from 5+ people
- [ ] Sleep on it for 48 hours
`,
  },
  {
    id: "domain-strategy",
    title: "Domain Strategy Checklist",
    description: "Complete checklist for planning your domain portfolio, including TLDs, redirects, and defensive registrations.",
    icon: "🌐",
    format: "MD",
    content: `# Domain Strategy Checklist

## Primary Domain
- [ ] Register .com version
- [ ] Register country-specific TLD if targeting local market
- [ ] Set up SSL certificate
- [ ] Configure HTTPS redirect

## Defensive Registrations
- [ ] Register common misspellings
- [ ] Register .net, .org alternatives
- [ ] Register with/without hyphens
- [ ] Register plural/singular versions
- [ ] Register relevant new TLDs (.io, .ai, .app)

## DNS Configuration
- [ ] Set up A records for primary domain
- [ ] Configure CNAME for www subdomain
- [ ] Set up MX records for email
- [ ] Configure SPF, DKIM, DMARC for email authentication
- [ ] Set up redirects for alternative domains

## Domain Security
- [ ] Enable domain lock/transfer protection
- [ ] Enable WHOIS privacy
- [ ] Set up auto-renewal
- [ ] Use strong registrar account password + 2FA
- [ ] Document all domains in a central spreadsheet

## Performance
- [ ] Point domain to CDN
- [ ] Configure proper TTL values
- [ ] Test DNS propagation after changes
- [ ] Monitor domain expiration dates

## Annual Review
- [ ] Audit all owned domains
- [ ] Renew critical domains for 5+ years
- [ ] Drop unused defensive domains
- [ ] Check for new relevant TLDs
`,
  },
  {
    id: "social-tracker",
    title: "Social Media Handle Tracker",
    description: "CSV template to track username availability and registration status across all major platforms.",
    icon: "📊",
    format: "CSV",
    content: `Platform,Desired Username,Status,Registered Date,URL,Notes
Twitter/X,,,,,
Instagram,,,,,
Facebook,,,,,
LinkedIn,,,,,
TikTok,,,,,
YouTube,,,,,
GitHub,,,,,
Reddit,,,,,
Pinterest,,,,,
Twitch,,,,,
Discord,,,,,
Threads,,,,,
Bluesky,,,,,
Mastodon,,,,,
Snapchat,,,,,
Medium,,,,,
Substack,,,,,
Behance,,,,,
Dribbble,,,,,
ProductHunt,,,,,
`,
  },
  {
    id: "brand-launch",
    title: "Brand Launch Checklist",
    description: "Step-by-step checklist covering everything from name selection to launch day and beyond.",
    icon: "🚀",
    format: "MD",
    content: `# Brand Launch Checklist

## Phase 1: Foundation (Weeks 1-2)
- [ ] Finalize brand name
- [ ] Register primary domain
- [ ] Register social media handles on all platforms
- [ ] File trademark application (if applicable)
- [ ] Set up business email

## Phase 2: Identity (Weeks 3-4)
- [ ] Design logo (primary + variations)
- [ ] Define brand colors (primary, secondary, accent)
- [ ] Choose brand typography
- [ ] Create brand guidelines document
- [ ] Design favicon and social media profile images

## Phase 3: Digital Presence (Weeks 5-6)
- [ ] Build website (landing page at minimum)
- [ ] Set up Google Analytics / privacy-friendly analytics
- [ ] Create Google Business Profile (if local)
- [ ] Set up social media profiles with consistent branding
- [ ] Write About page / bio
- [ ] Set up email newsletter

## Phase 4: Content (Weeks 7-8)
- [ ] Write 3-5 launch blog posts
- [ ] Create social media content calendar
- [ ] Prepare launch announcement
- [ ] Create press kit / media page
- [ ] Record intro video (optional)

## Phase 5: Pre-Launch (Week 9)
- [ ] Test all links and forms
- [ ] Review SEO basics (titles, descriptions, schema)
- [ ] Set up monitoring (Google Search Console, social mentions)
- [ ] Prepare launch day social posts
- [ ] Notify friends, family, early supporters

## Phase 6: Launch Day
- [ ] Publish website
- [ ] Send launch email
- [ ] Post on all social channels
- [ ] Submit to Product Hunt / directories
- [ ] Monitor for issues

## Phase 7: Post-Launch (Ongoing)
- [ ] Respond to all comments and messages
- [ ] Track analytics weekly
- [ ] Publish content on schedule
- [ ] Gather and display testimonials
- [ ] Iterate based on feedback
`,
  },
  {
    id: "competitor-analysis",
    title: "Competitor Analysis Template",
    description: "CSV template to systematically analyze competitor branding, domains, social presence, and positioning.",
    icon: "🔍",
    format: "CSV",
    content: `Competitor Name,Website,Domain TLD,Tagline,Primary Color,Social Followers (Total),Twitter Handle,Instagram Handle,Unique Selling Proposition,Strengths,Weaknesses,Opportunities
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,,,
`,
  },
];

export default function TemplatesPage() {
  const [preview, setPreview] = useState<string | null>(null);

  const download = useCallback((t: Template) => {
    // Track download
    if (typeof window !== "undefined") {
      const stats = JSON.parse(localStorage.getItem("brandscout-template-downloads") || "{}");
      stats[t.id] = (stats[t.id] || 0) + 1;
      localStorage.setItem("brandscout-template-downloads", JSON.stringify(stats));
    }

    const ext = t.format === "CSV" ? "csv" : "md";
    const mime = t.format === "CSV" ? "text/csv" : "text/markdown";
    const blob = new Blob([t.content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${t.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Content Templates</h1>
      <p className="text-muted-foreground mb-8">Professional templates to streamline your branding process. Download and customize for your needs.</p>

      <div className="grid gap-4">
        {templates.map((t) => (
          <div key={t.id} className="p-6 rounded-xl border border-border bg-card hover:border-foreground/20 transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">{t.title}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 text-muted-foreground font-mono">{t.format}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreview(preview === t.id ? null : t.id)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-surface transition-colors"
                  >
                    {preview === t.id ? "Hide Preview" : "Preview"}
                  </button>
                  <button
                    onClick={() => download(t)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
            {preview === t.id && (
              <pre className="mt-4 p-4 rounded-lg bg-surface text-xs overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap font-mono border border-border">
                {t.content}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
