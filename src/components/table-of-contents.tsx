"use client";

import { useState, useEffect } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content, mode = "both" }: { content: string; mode?: "mobile" | "desktop" | "both" }) {
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);

  // Extract headings from markdown content
  const headings: TocItem[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const text = match[2].replace(/[*_`\[\]]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      headings.push({ id, text, level: match[1].length });
    }
  }

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (headings.length < 3) return null;

  return (
    <>
      {/* Mobile toggle */}
      {(mode === "both" || mode === "mobile") && <div className="lg:hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <span>{open ? "▾" : "▸"}</span> Table of Contents
        </button>
        {open && (
          <nav className="mt-2 pl-2 border-l-2 border-border space-y-1">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                className={`block text-sm py-0.5 transition-colors ${
                  h.level === 3 ? "pl-3" : ""
                } ${activeId === h.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        )}
      </div>}

      {/* Desktop sticky sidebar */}
      {(mode === "both" || mode === "desktop") && <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto w-56 shrink-0 pl-6 border-l border-border space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">On this page</p>
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`block text-sm py-0.5 transition-colors ${
              h.level === 3 ? "pl-3" : ""
            } ${activeId === h.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            {h.text}
          </a>
        ))}
      </nav>}
    </>
  );
}
