export interface ExportData {
  query: string;
  score: number;
  domains: { domain: string; status: string }[];
  usernames: { platform: string; username: string; status: string }[];
  suggestions: string[];
}

export function exportCSV(data: ExportData): string {
  const lines: string[] = [];
  lines.push("BrandScout Report");
  lines.push(`Query,${data.query}`);
  lines.push(`Score,${data.score}/100`);
  lines.push("");
  lines.push("Domain,Status");
  for (const d of data.domains) {
    lines.push(`${d.domain},${d.status}`);
  }
  lines.push("");
  lines.push("Platform,Username,Status");
  for (const u of data.usernames) {
    lines.push(`${u.platform},${u.username},${u.status}`);
  }
  lines.push("");
  lines.push("Suggestions");
  for (const s of data.suggestions) {
    lines.push(s);
  }
  return lines.join("\n");
}

export function exportTXT(data: ExportData): string {
  const lines: string[] = [];
  lines.push("═══════════════════════════════════");
  lines.push("       BrandScout Report");
  lines.push("═══════════════════════════════════");
  lines.push(`Query: ${data.query}`);
  lines.push(`Score: ${data.score}/100`);
  lines.push("");
  lines.push("── Domains ──");
  for (const d of data.domains) {
    const icon = d.status === "available" ? "✓" : d.status === "taken" ? "✗" : "?";
    lines.push(`  ${icon} ${d.domain} — ${d.status}`);
  }
  lines.push("");
  lines.push("── Usernames ──");
  for (const u of data.usernames) {
    const icon = u.status === "available" ? "✓" : u.status === "taken" ? "✗" : "?";
    lines.push(`  ${icon} ${u.platform} (@${u.username}) — ${u.status}`);
  }
  lines.push("");
  lines.push("── Suggestions ──");
  for (const s of data.suggestions) {
    lines.push(`  • ${s}`);
  }
  lines.push("");
  lines.push("Disclaimer: Availability can change quickly.");
  return lines.join("\n");
}
