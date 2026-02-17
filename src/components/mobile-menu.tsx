"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/", label: "🔍 Search" },
  { href: "/ai-generator", label: "🤖 AI Generator" },
  { href: "/compare", label: "⚖️ Compare Names" },
  { href: "/bulk", label: "📊 Bulk Check" },
  { href: "/saved", label: "⭐ Saved" },
  { href: "/blog", label: "📝 Blog" },
  { href: "/docs", label: "📡 API Docs" },
  { href: "/tools", label: "🧰 All Tools" },
  { href: "/dashboard", label: "📈 Dashboard" },
  { href: "/achievements", label: "🏆 Achievements" },
  { href: "/templates", label: "📋 Templates" },
  { href: "/glossary", label: "📖 Glossary" },
  { href: "/help", label: "❓ Help" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {open && (
        <>
          {/* Backdrop - full screen overlay */}
          <div 
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9998 }}
            onClick={() => setOpen(false)}
          />
          {/* Menu panel - inline styles to guarantee iOS Safari rendering */}
          <div style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "280px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column" as const,
          }} className="bg-background border-l border-border shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {/* Nav items */}
            <nav style={{ flex: 1, overflowY: "auto" }} className="py-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3.5 text-[15px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            {/* Footer */}
            <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground shrink-0">
              brandscout.net — Free forever
            </div>
          </div>
        </>
      )}
    </div>
  );
}
