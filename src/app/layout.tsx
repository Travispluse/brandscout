import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextSizeToggle } from "@/components/text-size-toggle";
import { MobileMenu } from "@/components/mobile-menu";
import { CookieConsent } from "@/components/cookie-consent";
import { LeadCapturePopup } from "@/components/lead-capture";
import "./globals.css";

const siteUrl = "https://brandscout.net";

export const metadata: Metadata = {
  title: {
    default: "BrandScout | Free Domain & Username Availability Checker",
    template: "%s | BrandScout",
  },
  description:
    "Check domain and social media username availability for your brand name instantly. Search .com, .net, .io, .ai domains and GitHub, Reddit, Twitch, Pinterest handles in one click. Free forever, no signup required.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  keywords: ["brand name checker", "domain availability", "username checker", "social media handle check", "domain search", "brand name search", "free domain checker"],
  openGraph: {
    title: "BrandScout | Free Domain & Username Availability Checker",
    description:
      "Check domain and social media username availability for your brand name instantly. Free forever, no signup required.",
    url: siteUrl,
    siteName: "BrandScout",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandScout | Free Domain & Username Availability Checker",
    description:
      "Check domain and username availability across platforms instantly. Free forever, no signup.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {
    google: "RmaV3xsilmb6rNZGyjBk9pPGBVu--aqIct0FPnxaX0E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BrandScout" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded-lg">
            Skip to content
          </a>
          <header role="banner" className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-shadow duration-300 supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-xl font-semibold tracking-tight">
                BrandScout
              </a>
              <div className="flex items-center gap-2 md:gap-4">
                <nav aria-label="Main navigation" className="hidden md:flex gap-4 text-sm text-muted-foreground flex-wrap">
                  <a href="/" className="hover:text-foreground transition-colors">Search</a>
                  <a href="/ai-generator" className="hover:text-foreground transition-colors">Generator</a>
                  <a href="/compare" className="hover:text-foreground transition-colors">Compare</a>
                  <a href="/bulk" className="hover:text-foreground transition-colors">Bulk</a>
                  <a href="/saved" className="hover:text-foreground transition-colors">Saved</a>
                  <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
                  <a href="/docs" className="hover:text-foreground transition-colors">API</a>
                  <a href="/tools" className="hover:text-foreground transition-colors">Tools</a>
                  <a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
                  <a href="/achievements" className="hover:text-foreground transition-colors">🏆</a>
                </nav>
                <TextSizeToggle />
                <ThemeToggle />
                <MobileMenu />
              </div>
            </div>
          </header>
          <main id="main-content" role="main">{children}</main>
          <footer role="contentinfo" className="border-t border-border mt-16">
            <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
                <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="/newsletter" className="hover:text-foreground transition-colors">Newsletter</a>
                <a href="/help" className="hover:text-foreground transition-colors">Help</a>
                <a href="/glossary" className="hover:text-foreground transition-colors">Glossary</a>
                <a href="/editorial-policy" className="hover:text-foreground transition-colors">Editorial Policy</a>
                <a href="/privacy-settings" className="hover:text-foreground transition-colors">Privacy Settings</a>
              </div>
              <p>© {new Date().getFullYear()} BrandScout. Free & open source.</p>
            </div>
          </footer>
          <CookieConsent />
          <LeadCapturePopup />
          <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
