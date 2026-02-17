import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Branding Tools",
  description: "Free branding tools: name availability checker, templates, glossary, and more. Everything you need to build your brand online.",
  alternates: { canonical: "/tools" },
};

const tools = [
  {
    title: "Brand Name Checker",
    description: "Check domain and social media username availability for any brand name instantly. Get a brand score and alternative suggestions.",
    href: "/",
    icon: "🔍",
  },
  {
    title: "Content Templates",
    description: "Download professional templates for brand naming, domain strategy, social media tracking, competitor analysis, and launch planning.",
    href: "/templates",
    icon: "📄",
  },
  {
    title: "Branding Glossary",
    description: "50+ branding, domain, DNS, and SEO terms explained simply. Your reference guide for digital brand building.",
    href: "/glossary",
    icon: "📖",
  },
  {
    title: "API Documentation",
    description: "Integrate brand name checking into your own applications with our free REST API. Full documentation and examples.",
    href: "/docs",
    icon: "⚡",
  },
  {
    title: "Help Center",
    description: "Find answers to common questions about using BrandScout, understanding results, API usage, and troubleshooting.",
    href: "/help",
    icon: "❓",
  },
  {
    title: "Dashboard",
    description: "Manage your API key, view usage statistics, and customize report branding for your exported results.",
    href: "/dashboard",
    icon: "📊",
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Branding Tools</h1>
      <p className="text-muted-foreground mb-8">Everything you need to research, plan, and launch your brand — all free.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="p-6 rounded-xl border border-border bg-card hover:border-foreground/20 transition-colors group"
          >
            <span className="text-3xl mb-3 block">{tool.icon}</span>
            <h2 className="text-lg font-semibold mb-1 group-hover:text-foreground transition-colors">{tool.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
