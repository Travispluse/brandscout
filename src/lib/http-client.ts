const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 OPR/110.0.0.0",
];

let uaIndex = 0;

export function getRandomUA(): string {
  const ua = USER_AGENTS[uaIndex % USER_AGENTS.length];
  uaIndex++;
  return ua;
}

// Domain-level concurrency and spacing
const domainSemaphores = new Map<string, { active: number; queue: (() => void)[] }>();
const domainLastRequest = new Map<string, number>();
const MAX_CONCURRENT_PER_DOMAIN = 3;

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

async function waitForSlot(domain: string): Promise<void> {
  let sem = domainSemaphores.get(domain);
  if (!sem) {
    sem = { active: 0, queue: [] };
    domainSemaphores.set(domain, sem);
  }

  if (sem.active >= MAX_CONCURRENT_PER_DOMAIN) {
    await new Promise<void>((resolve) => sem!.queue.push(resolve));
  }
  sem.active++;

  // Add random delay 200-500ms between requests to same domain
  const last = domainLastRequest.get(domain) || 0;
  const elapsed = Date.now() - last;
  const delay = 200 + Math.random() * 300;
  if (elapsed < delay) {
    await new Promise((r) => setTimeout(r, delay - elapsed));
  }
  domainLastRequest.set(domain, Date.now());
}

function releaseSlot(domain: string): void {
  const sem = domainSemaphores.get(domain);
  if (!sem) return;
  sem.active--;
  if (sem.queue.length > 0) {
    const next = sem.queue.shift()!;
    next();
  }
}

export async function smartFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const domain = getDomain(url);
  await waitForSlot(domain);
  try {
    const headers = new Headers(options.headers);
    if (!headers.has("User-Agent")) {
      headers.set("User-Agent", getRandomUA());
    }
    return await fetch(url, {
      ...options,
      headers,
      signal: options.signal || AbortSignal.timeout(8000),
      redirect: "follow",
    });
  } finally {
    releaseSlot(domain);
  }
}
