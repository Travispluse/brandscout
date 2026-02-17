import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://brandscout.net";

export const metadata: Metadata = {
  title: {
    default: "BrandScout — Check Domain & Username Availability Instantly | Free Tool",
    template: "%s — BrandScout",
  },
  description:
    "Free brand name availability checker. Instantly search domains (.com, .io, .ai) and social media usernames (Twitter, Instagram, GitHub) in one click. No signup required.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "BrandScout — Check Domain & Username Availability Instantly",
    description:
      "Free tool to check domain and social media username availability for your brand name. Results in seconds.",
    url: siteUrl,
    siteName: "BrandScout",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandScout — Free Brand Name Availability Checker",
    description:
      "Check domain and username availability across platforms instantly. Free, no signup.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-semibold tracking-tight">
              BrandScout
            </a>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors">Search</a>
              <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
              <a href="/docs" className="hover:text-foreground transition-colors">API</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-border mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BrandScout. Free & open source.
          </div>
        </footer>
      </body>
    </html>
  );
}
