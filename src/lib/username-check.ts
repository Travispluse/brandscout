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
  // Custom check function: returns status based on response
  checkFn?: (res: Response, body: string) => { status: UsernameStatus; confidence: number };
}

const defaultCheck = (notFoundCodes: number[]) => (res: Response): { status: UsernameStatus; confidence: number } => {
  if (notFoundCodes.includes(res.status)) return { status: "available", confidence: 0.85 };
  if (res.ok || res.status === 302 || res.status === 301) return { status: "taken", confidence: 0.9 };
  return { status: "unknown", confidence: 0.3 };
};

const PLATFORMS: PlatformConfig[] = [
  { name: "GitHub", urlTemplate: "https://github.com/{}" },
  {
    name: "Reddit",
    urlTemplate: "https://www.reddit.com/user/{}/about.json",
    method: "GET",
    checkFn: (_res: Response, body: string) => {
      try {
        const data = JSON.parse(body);
        if (data?.data?.name) return { status: "taken" as UsernameStatus, confidence: 0.95 };
        if (data?.error === 404 || data?.message === "Not Found") return { status: "available" as UsernameStatus, confidence: 0.9 };
      } catch { /* fall through */ }
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
      if (res.ok && body.includes("PAGE_NOT_FOUND")) return { status: "available" as UsernameStatus, confidence: 0.85 };
      if (res.ok && !body.includes("PAGE_NOT_FOUND")) return { status: "taken" as UsernameStatus, confidence: 0.9 };
      return { status: "unknown" as UsernameStatus, confidence: 0.3 };
    },
  },
  { name: "Vimeo", urlTemplate: "https://vimeo.com/{}" },
];

export { PLATFORMS };

async function checkPlatform(platform: PlatformConfig, username: string): Promise<UsernameResult> {
  const profileUrl = platform.urlTemplate.replace("{}", username);
  const displayUrl = platform.name === "Reddit"
    ? `https://www.reddit.com/user/${username}`
    : profileUrl;
  try {
    const method = platform.method || "HEAD";
    const res = await fetch(profileUrl, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    let result: { status: UsernameStatus; confidence: number };

    if (platform.checkFn) {
      const body = method === "GET" ? await res.text() : "";
      result = platform.checkFn(res, body);
    } else {
      result = defaultCheck([404])(res);
    }

    return { platform: platform.name, username, status: result.status, profileUrl: displayUrl, source: "http", confidence: result.confidence };
  } catch {
    return { platform: platform.name, username, status: "unknown", profileUrl: displayUrl, source: "http", confidence: 0.2 };
  }
}

export async function checkAllUsernames(name: string): Promise<UsernameResult[]> {
  const username = name.toLowerCase().replace(/[^a-z0-9-_]/g, "");
  return Promise.all(PLATFORMS.map(p => checkPlatform(p, username)));
}
