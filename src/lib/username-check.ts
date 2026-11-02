import { smartFetch } from "./http-client";
import { cache, usernameCacheKey, USERNAME_CACHE_TTL } from "./cache";

export type UsernameStatus = "available" | "taken" | "unknown";

interface UsernameResult {
  platform: string;
  username: string;
  status: UsernameStatus;
  profileUrl: string;
  source: string;
  confidence: number;
}

interface PlatformConfig {
  name: string;
  urlTemplate: string;
  method?: "HEAD" | "GET";
  checkFn?: (res: Response, body: string) => { status: UsernameStatus; confidence: number };
}

const defaultCheck =
  (notFoundCodes: number[]) =>
  (res: Response): { status: UsernameStatus; confidence: number } => {
    if (notFoundCodes.includes(res.status)) return { status: "available", confidence: 0.85 };
    if (res.ok || res.status === 302 || res.status === 301) return { status: "taken", confidence: 0.9 };
    return { status: "unknown", confidence: 0.3 };
  };

const PLATFORMS: PlatformConfig[] = [
  // --- Existing ---
  { name: "GitHub", urlTemplate: "https://github.com/{}" },
  {
    name: "Reddit",
    urlTemplate: "https://www.reddit.com/user/{}/about.json",
    method: "GET",
    checkFn: (_res: Response, body: string) => {
      try {
        const data = JSON.parse(body);
        if (data?.data?.name) return { status: "taken" as UsernameStatus, confidence: 0.95 };
        if (data?.error === 404 || data?.message === "Not Found")
          return { status: "available" as UsernameStatus, confidence: 0.9 };
      } catch {
        /* fall through */
      }
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  { name: "Pinterest", urlTemplate: "https://www.pinterest.com/{}/" },
  { name: "Twitch", urlTemplate: "https://www.twitch.tv/{}" },
  {
    name: "Medium",
    urlTemplate: "https://medium.com/@{}",
    method: "GET",
    checkFn: (res: Response, body: string) => {
      if (res.status === 404) return { status: "available" as UsernameStatus, confidence: 0.9 };
      if (res.ok && body.includes("PAGE_NOT_FOUND"))
        return { status: "available" as UsernameStatus, confidence: 0.85 };
      if (res.ok && !body.includes("PAGE_NOT_FOUND"))
        return { status: "taken" as UsernameStatus, confidence: 0.9 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  { name: "Vimeo", urlTemplate: "https://vimeo.com/{}" },

  // --- New platforms ---
  {
    name: "Instagram",
    urlTemplate: "https://www.instagram.com/{}/",
    method: "GET",
    checkFn: (res: Response, body: string) => {
      if (res.status === 404) return { status: "available" as UsernameStatus, confidence: 0.9 };
      if (body.includes("Page Not Found") || body.includes("Sorry, this page isn"))
        return { status: "available" as UsernameStatus, confidence: 0.8 };
      if (res.ok) return { status: "taken" as UsernameStatus, confidence: 0.75 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  {
    name: "X/Twitter",
    urlTemplate: "https://x.com/{}",
    method: "HEAD",
    checkFn: (res: Response) => {
      if (res.status === 404) return { status: "available" as UsernameStatus, confidence: 0.85 };
      if (res.ok || res.status === 302 || res.status === 301)
        return { status: "taken" as UsernameStatus, confidence: 0.85 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  {
    name: "TikTok",
    urlTemplate: "https://www.tiktok.com/@{}",
    method: "GET",
    checkFn: (res: Response, body: string) => {
      if (res.status === 404) return { status: "available" as UsernameStatus, confidence: 0.9 };
      if (body.includes("Couldn't find this account") || body.includes("couldn&#39;t find this account"))
        return { status: "available" as UsernameStatus, confidence: 0.85 };
      if (res.ok) return { status: "taken" as UsernameStatus, confidence: 0.8 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  {
    name: "Facebook",
    urlTemplate: "https://www.facebook.com/{}",
    method: "HEAD",
    checkFn: (res: Response) => {
      if (res.status === 404) return { status: "available" as UsernameStatus, confidence: 0.8 };
      // Facebook almost always returns 200, so we can't be sure
      if (res.ok) return { status: "unknown" as UsernameStatus, confidence: 0.3 };
      return { status: "unknown" as UsernameStatus, confidence: 0.2 };
    },
  },
  {
    name: "LinkedIn",
    urlTemplate: "https://www.linkedin.com/in/{}",
    method: "HEAD",
    checkFn: (res: Response) => {
      if (res.status === 404 || res.status === 999)
        return { status: "available" as UsernameStatus, confidence: 0.8 };
      if (res.ok) return { status: "taken" as UsernameStatus, confidence: 0.8 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  { name: "YouTube", urlTemplate: "https://www.youtube.com/@{}" },
  {
    name: "Threads",
    urlTemplate: "https://www.threads.net/@{}",
    method: "GET",
    checkFn: (res: Response, body: string) => {
      if (res.status === 404) return { status: "available" as UsernameStatus, confidence: 0.9 };
      if (body.includes("Sorry, this page isn") || body.includes("Page not found"))
        return { status: "available" as UsernameStatus, confidence: 0.8 };
      if (res.ok) return { status: "taken" as UsernameStatus, confidence: 0.75 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  { name: "Snapchat", urlTemplate: "https://www.snapchat.com/add/{}" },
  {
    name: "Discord",
    urlTemplate: "https://discord.com/{}",
    checkFn: () => ({ status: "unknown" as UsernameStatus, confidence: 0 }),
  },
  {
    name: "Telegram",
    urlTemplate: "https://t.me/{}",
    method: "GET",
    checkFn: (res: Response, body: string) => {
      if (res.status === 404) return { status: "available" as UsernameStatus, confidence: 0.85 };
      if (body.includes("If you have Telegram") || body.includes("tgme_page_extra"))
        return { status: "available" as UsernameStatus, confidence: 0.7 };
      if (res.ok && (body.includes("tgme_page_photo") || body.includes("tgme_header_title")))
        return { status: "taken" as UsernameStatus, confidence: 0.8 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  { name: "Dribbble", urlTemplate: "https://dribbble.com/{}" },
  { name: "Behance", urlTemplate: "https://www.behance.net/{}" },
  { name: "Etsy", urlTemplate: "https://www.etsy.com/shop/{}" },
  { name: "SoundCloud", urlTemplate: "https://soundcloud.com/{}" },
];

export { PLATFORMS };

async function checkPlatform(platform: PlatformConfig, username: string): Promise<UsernameResult> {
  const profileUrl = platform.urlTemplate.replace("{}", username);
  const displayUrl =
    platform.name === "Reddit"
      ? `https://www.reddit.com/user/${username}`
      : platform.name === "Discord"
        ? `https://discord.com`
        : profileUrl;

  const cKey = usernameCacheKey(platform.name, username);
  const cached = cache.get<UsernameResult>(cKey);
  if (cached) return cached;

  // Discord can't be checked
  if (platform.name === "Discord") {
    const r: UsernameResult = {
      platform: platform.name,
      username,
      status: "unknown",
      profileUrl: displayUrl,
      source: "skip",
      confidence: 0,
    };
    return r;
  }

  try {
    const method = platform.method || "HEAD";
    const res = await smartFetch(profileUrl, { method });

    let result: { status: UsernameStatus; confidence: number };

    if (platform.checkFn) {
      const body = method === "GET" ? await res.text() : "";
      result = platform.checkFn(res, body);
    } else {
      result = defaultCheck([404])(res);
    }

    const r: UsernameResult = {
      platform: platform.name,
      username,
      status: result.status,
      profileUrl: displayUrl,
      source: "http",
      confidence: result.confidence,
    };
    cache.set(cKey, r, USERNAME_CACHE_TTL);
    return r;
  } catch {
    return {
      platform: platform.name,
      username,
      status: "unknown",
      profileUrl: displayUrl,
      source: "http",
      confidence: 0.2,
    };
  }
}

export async function checkAllUsernames(name: string): Promise<UsernameResult[]> {
  const username = name.toLowerCase().replace(/[^a-z0-9-_]/g, "");
  return Promise.all(PLATFORMS.map((p) => checkPlatform(p, username)));
}

export async function checkSinglePlatform(
  platformName: string,
  name: string
): Promise<UsernameResult | null> {
  const platform = PLATFORMS.find((p) => p.name === platformName);
  if (!platform) return null;
  const username = name.toLowerCase().replace(/[^a-z0-9-_]/g, "");
  return checkPlatform(platform, username);
}
