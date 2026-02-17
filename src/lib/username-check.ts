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
  notFoundIndicator: number[]; // HTTP status codes indicating not found
}

const PLATFORMS: PlatformConfig[] = [
  { name: "GitHub", urlTemplate: "https://github.com/{}", notFoundIndicator: [404] },
  { name: "Reddit", urlTemplate: "https://www.reddit.com/user/{}", notFoundIndicator: [404] },
  { name: "Pinterest", urlTemplate: "https://www.pinterest.com/{}/", notFoundIndicator: [404] },
  { name: "Twitch", urlTemplate: "https://www.twitch.tv/{}", notFoundIndicator: [404] },
  { name: "Medium", urlTemplate: "https://medium.com/@{}", notFoundIndicator: [404] },
  { name: "Vimeo", urlTemplate: "https://vimeo.com/{}", notFoundIndicator: [404] },
];

export { PLATFORMS };

async function checkPlatform(platform: PlatformConfig, username: string): Promise<UsernameResult> {
  const profileUrl = platform.urlTemplate.replace("{}", username);
  try {
    const res = await fetch(profileUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BrandScout/1.0)",
      },
    });

    let status: UsernameStatus;
    let confidence = 0.7;

    if (platform.notFoundIndicator.includes(res.status)) {
      status = "available";
      confidence = 0.85;
    } else if (res.ok || res.status === 302 || res.status === 301) {
      status = "taken";
      confidence = 0.9;
    } else {
      status = "unknown";
      confidence = 0.3;
    }

    return { platform: platform.name, username, status, profileUrl, source: "http", confidence };
  } catch {
    return { platform: platform.name, username, status: "unknown", profileUrl, source: "http", confidence: 0.2 };
  }
}

export async function checkAllUsernames(name: string): Promise<UsernameResult[]> {
  const username = name.toLowerCase().replace(/[^a-z0-9-_]/g, "");
  return Promise.all(PLATFORMS.map(p => checkPlatform(p, username)));
}
