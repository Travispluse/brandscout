"use client";

import { useState, useMemo } from "react";

interface FAQ {
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  // How to use BrandScout
  { category: "How to Use BrandScout", question: "What is BrandScout?", answer: "BrandScout is a free tool that checks domain name and social media username availability for your brand. Enter a name and instantly see if it's available across popular domain extensions and social platforms." },
  { category: "How to Use BrandScout", question: "How do I search for a brand name?", answer: "Simply type your desired brand name in the search box on the homepage and press Enter or click Search. BrandScout will check availability across domains (.com, .net, .io, .ai, etc.) and social media platforms (GitHub, Reddit, Twitch, Pinterest, and more)." },
  { category: "How to Use BrandScout", question: "Is BrandScout really free?", answer: "Yes, BrandScout is completely free with no signup required. You can search unlimited brand names, export results, and use all features without paying anything." },
  { category: "How to Use BrandScout", question: "Can I check multiple names at once?", answer: "Yes! You can enter multiple names separated by commas in the search box. BrandScout will check each one and let you compare results side by side." },
  { category: "How to Use BrandScout", question: "What platforms does BrandScout check?", answer: "BrandScout checks domain availability for popular TLDs (.com, .net, .org, .io, .ai, .app, .dev, .co) and username availability on platforms like GitHub, Reddit, Twitch, and Pinterest. We're constantly adding more." },

  // Understanding Results
  { category: "Understanding Results", question: "What does the brand score mean?", answer: "The brand score (0-100) is a composite rating based on domain availability, username availability, name length, pronounceability, and uniqueness. A higher score means the name has better overall availability and branding potential." },
  { category: "Understanding Results", question: "What do the status icons mean?", answer: "✓ (green) means available — you can register it. ✗ (red) means taken — someone else owns it. ? (gray) means unknown — we couldn't determine the status, which may happen due to rate limiting or network issues." },
  { category: "Understanding Results", question: "Why does a domain show as 'unknown'?", answer: "Unknown status can occur when DNS servers are slow to respond, the TLD has rate limits, or there's a temporary network issue. Try searching again in a few minutes." },
  { category: "Understanding Results", question: "Are the results 100% accurate?", answer: "Results are highly accurate but domain and username availability can change at any moment. We recommend registering available names promptly. Always verify on the official registrar or platform before purchasing." },
  { category: "Understanding Results", question: "What are the name suggestions?", answer: "When your searched name has limited availability, BrandScout suggests alternative names using prefixes, suffixes, and creative variations to help you find available options." },

  // API Usage
  { category: "API Usage", question: "Does BrandScout have an API?", answer: "Yes! BrandScout offers a free REST API. Visit the API Documentation page (/docs) for endpoints, request/response formats, and usage examples." },
  { category: "API Usage", question: "How do I get an API key?", answer: "Go to the Dashboard (/dashboard) and click 'Generate API Key'. The key is generated client-side and stored in your browser. Include it in the X-API-Key header with your requests." },
  { category: "API Usage", question: "What are the API rate limits?", answer: "The API is rate-limited to prevent abuse. Current limits are displayed in the API documentation. If you need higher limits, contact us." },
  { category: "API Usage", question: "Can I use the API commercially?", answer: "Yes, the API is free for both personal and commercial use. Please review our Terms of Service for full details on acceptable use." },

  // Account & Data
  { category: "Account & Data", question: "Do I need an account?", answer: "No. BrandScout works without any account or signup. All data (search history, preferences, API keys) is stored locally in your browser using localStorage." },
  { category: "Account & Data", question: "What data does BrandScout store?", answer: "BrandScout stores data only in your browser's localStorage: search history, cookie preferences, API key, brand settings, and usage statistics. No data is sent to or stored on our servers." },
  { category: "Account & Data", question: "How do I export my data?", answer: "Visit Privacy Settings (/privacy-settings) and click 'Download My Data' to export all locally stored data as a JSON file." },
  { category: "Account & Data", question: "How do I delete my data?", answer: "Visit Privacy Settings (/privacy-settings) and click 'Delete My Data' to clear all localStorage data. This action cannot be undone." },

  // Troubleshooting
  { category: "Troubleshooting", question: "The search is not returning results", answer: "This can happen if you're offline, your browser blocks JavaScript, or there's a temporary issue with DNS providers. Check your internet connection and try again. Clearing your browser cache may also help." },
  { category: "Troubleshooting", question: "Results are loading slowly", answer: "Domain and username checks involve multiple API calls. Complex names or checking many platforms simultaneously can take a few seconds. This is normal." },
  { category: "Troubleshooting", question: "Can I use BrandScout on mobile?", answer: "Yes! BrandScout is fully responsive and works on all modern mobile browsers. You can even add it to your home screen as a PWA for quick access." },
  { category: "Troubleshooting", question: "The export feature isn't working", answer: "Export uses browser download functionality. Make sure your browser isn't blocking downloads. If using an ad blocker, try whitelisting brandscout.net." },
  { category: "Troubleshooting", question: "Why can't I check certain usernames?", answer: "Some platforms have strict rate limits or block automated checks. If a platform consistently shows 'unknown', it may be temporarily blocking our checks. Results should return to normal shortly." },
];

const categories = [...new Set(faqs.map(f => f.category))];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return faqs;
    const q = search.toLowerCase();
    return faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }, [search]);

  const filteredCategories = categories.filter(c => filtered.some(f => f.category === c));

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Help Center</h1>
      <p className="text-muted-foreground mb-6">Find answers to common questions about BrandScout.</p>

      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
        placeholder="Search help articles..."
        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm mb-8"
      />

      {filteredCategories.map(cat => (
        <section key={cat} className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{cat}</h2>
          <div className="space-y-2">
            {filtered.filter(f => f.category === cat).map((faq, i) => {
              const globalIndex = faqs.indexOf(faq);
              const isOpen = openIndex === globalIndex;
              return (
                <div key={globalIndex} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-surface transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-muted-foreground ml-2 shrink-0">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No results found for &quot;{search}&quot;</p>
      )}
    </div>
  );
}
