"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

function MenuOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div id="mobile-menu-portal" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
      />
      {/* Panel */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "280px",
        backgroundColor: "var(--background, #ffffff)",
        borderLeft: "1px solid var(--border, #e5e7eb)",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border, #e5e7eb)", flexShrink: 0 }}>
          <span style={{ fontSize: "18px", fontWeight: 600 }}>Menu</span>
          <button
            onClick={onClose}
            style={{ padding: "8px", minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer" }}
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: "block",
                padding: "14px 20px",
                fontSize: "15px",
                color: "var(--muted-foreground, #6b7280)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {/* Footer */}
        <div style={{ borderTop: "1px solid var(--border, #e5e7eb)", padding: "16px 20px", fontSize: "12px", color: "var(--muted-foreground, #6b7280)", flexShrink: 0 }}>
          brandscout.net — Free forever
        </div>
      </div>
    </div>,
    document.body
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      {mounted && open && <MenuOverlay onClose={() => setOpen(false)} />}
    </div>
  );
}
