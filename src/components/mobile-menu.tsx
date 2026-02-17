"use client";

import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Search" },
  { href: "/ai-generator", label: "AI Generator" },
  { href: "/compare", label: "Compare" },
  { href: "/bulk", label: "Bulk Check" },
  { href: "/saved", label: "Saved" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "API Docs" },
  { href: "/tools", label: "Tools" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/achievements", label: "🏆 Achievements" },
  { href: "/help", label: "Help" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" />
          {/* Slide-in menu */}
          <nav className="fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-50 shadow-xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="py-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors min-h-[44px] flex items-center"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
