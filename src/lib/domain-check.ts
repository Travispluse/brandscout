import dns from "dns/promises";
import { cache, domainCacheKey, DOMAIN_CACHE_TTL } from "./cache";

const TLDS = [".com", ".net", ".org", ".co", ".io", ".ai", ".app"] as const;
export type TLD = (typeof TLDS)[number];
export { TLDS };

export type DomainStatus = "available" | "taken" | "unknown";

interface DomainResult {
  domain: string;
  tld: string;
  status: DomainStatus;
  source: string;
}

async function checkRDAP(domain: string): Promise<DomainStatus> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    return "unknown";
  } catch {
    return "unknown";
  }
}

async function checkDNS(domain: string): Promise<DomainStatus> {
  try {
    await dns.resolve(domain);
    return "taken";
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "ENODATA") return "available";
    return "unknown";
  }
}

export async function checkDomain(name: string, tld: string): Promise<DomainResult> {
  const domain = `${name}${tld}`;
  const cacheKey = domainCacheKey(domain);
  const cached = cache.get<DomainResult>(cacheKey);
  if (cached) return cached;

  let status = await checkRDAP(domain);
  let source = "rdap";

  if (status === "unknown") {
    status = await checkDNS(domain);
    source = status === "unknown" ? "fallback" : "dns";
  }

  const result = { domain, tld, status, source };
  cache.set(cacheKey, result, DOMAIN_CACHE_TTL);
  return result;
}

export async function checkAllDomains(name: string): Promise<DomainResult[]> {
  const clean = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
  return Promise.all(TLDS.map(tld => checkDomain(clean, tld)));
}
