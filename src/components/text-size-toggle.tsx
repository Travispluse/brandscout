"use client";

import { useEffect, useState } from "react";

export function TextSizeToggle() {
  const [large, setLarge] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const pref = localStorage.getItem("brandscout-large-text");
    if (pref === "true") {
      setLarge(true);
      document.body.classList.add("large-text");
    }
  }, []);

  const toggle = () => {
    const next = !large;
    setLarge(next);
    document.body.classList.toggle("large-text", next);
    localStorage.setItem("brandscout-large-text", String(next));
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-surface transition-colors text-muted-foreground hover:text-foreground text-sm font-bold"
      aria-label={large ? "Normal text size" : "Large text size"}
      title={large ? "Normal text" : "Large text"}
    >
      {large ? "A" : "A+"}
    </button>
  );
}
