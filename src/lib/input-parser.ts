import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().min(1, "Please enter a business name or domain").max(63, "Input too long").trim(),
});

export type SearchInput = z.infer<typeof searchSchema>;

export function parseInput(query: string): { type: "name" | "domain"; value: string } {
  const trimmed = query.trim().toLowerCase();

  // Check if it looks like a domain
  const domainRegex = /^[a-z0-9-]+\.[a-z]{2,}$/;
  if (domainRegex.test(trimmed)) {
    const parts = trimmed.split(".");
    return { type: "domain", value: parts[0] };
  }

  // Treat as a name
  return { type: "name", value: trimmed.replace(/[^a-z0-9]/g, "") };
}
