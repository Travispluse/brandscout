import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
// TextSizeToggle moved to dashboard/settings to reduce header clutter
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
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G2EKY15D8R" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-G2EKY15D8R');` }} />
        {/* Microsoft Clarity */}
        <script dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vivwtse9is");` }} />
        {/* Ahrefs Analytics */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="Kfbd64UPnwDZQC22Uas+rw" async />
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
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <a href="/" className="text-xl font-semibold tracking-tight shrink-0">
                BrandScout
              </a>
              {/* Desktop nav - only show core items, rest in Tools dropdown */}
              <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
                <a href="/" className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-surface transition-colors">Search</a>
                <a href="/ai-generator" className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-surface transition-colors">Generator</a>
                <a href="/compare" className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-surface transition-colors">Compare</a>
                <a href="/bulk" className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-surface transition-colors">Bulk</a>
                <a href="/blog" className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-surface transition-colors">Blog</a>
                <a href="/docs" className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-surface transition-colors">API</a>
                <a href="/tools" className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-surface transition-colors">More</a>
              </nav>
              <div className="flex items-center gap-1">
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
              <p className="mt-1">Need a full SEO audit? Try <a href="https://auditmysite.app" target="_blank" rel="noopener" className="underline hover:text-foreground transition-colors">AuditMySite.app</a></p>
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
