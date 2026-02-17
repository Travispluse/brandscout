"use client";

export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center group ml-1">
      <span className="cursor-help text-muted-foreground hover:text-foreground transition-colors text-xs">
        ⓘ
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-foreground text-background text-xs p-2.5 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </span>
    </span>
  );
}
