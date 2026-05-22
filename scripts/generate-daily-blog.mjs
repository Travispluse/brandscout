#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "blog");
const IMAGE_DIR = path.join(ROOT, "public", "blog");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-5.2";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
const SITE_URL = "https://brandscout.net";

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const [key, ...value] = arg.replace(/^--/, "").split("=");
  args.set(key, value.join("=") || "true");
}

const dryRun = args.has("dry-run");
const date = args.get("date") || new Date().toISOString().slice(0, 10);
const requestedTopic = args.get("topic") || "";

const categories = [
  "brand-naming",
  "domain-strategy",
  "social-handles",
  "seo",
  "business-legal",
  "ecommerce",
  "growth-marketing",
  "technical",
  "personal-branding",
];

const topicSeeds = [
  "how to choose a brand name when every good domain feels taken",
  "launch checklist for reserving brand domains and social handles",
  "how local businesses can pick names that still work online",
  "what to check before buying a premium domain",
  "how to rename a business without losing search visibility",
  "how to compare two possible brand names with real-world signals",
  "when to use a modifier like get, try, use, or app in a domain",
  "how to build a consistent handle strategy across social platforms",
  "what makes a brand name easy to say, spell, and remember",
  "how to avoid naming conflicts before a product launch",
  "domain extension choices for creators, startups, and service businesses",
  "how to audit a name for SEO, trust, and customer recall",
  "how to turn customer language into better brand name ideas",
  "what to do when your preferred username is taken everywhere",
  "how to pick a name that works in email addresses and invoices",
];

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function hashToIndex(input, length) {
  const hash = crypto.createHash("sha256").update(input).digest();
  return hash.readUInt32BE(0) % length;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-+$/g, "");
}

function extractFrontmatterValue(raw, key) {
  const match = raw.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, "m"));
  return match?.[1]?.trim() || "";
}

async function getExistingPosts() {
  const files = await fs.readdir(CONTENT_DIR);
  const posts = [];

  for (const file of files.filter((name) => name.endsWith(".mdx"))) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
    posts.push({
      slug,
      title: extractFrontmatterValue(raw, "title") || titleFromSlug(slug),
      category: extractFrontmatterValue(raw, "category") || "brand-naming",
      excerpt: extractFrontmatterValue(raw, "excerpt"),
    });
  }

  return posts.sort((a, b) => a.slug.localeCompare(b.slug));
}

function pickInternalLinks(posts, topic) {
  const terms = new Set(
    topic
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 3)
  );

  return posts
    .map((post) => {
      const haystack = `${post.title} ${post.slug} ${post.category}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (haystack.includes(term)) score += 1;
      }
      if (post.category === "brand-naming" || post.category === "domain-strategy" || post.category === "social-handles") score += 0.5;
      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, 8)
    .map((post) => ({
      title: post.title.replace(/\s*\|.*$/, ""),
      href: `/blog/${post.slug}`,
      category: post.category,
    }));
}

function extractOutputText(response) {
  if (typeof response.output_text === "string") return response.output_text;

  const chunks = [];
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
      if (typeof content.output_text === "string") chunks.push(content.output_text);
    }
  }
  return chunks.join("\n").trim();
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model response did not contain JSON.");
    return JSON.parse(match[0]);
  }
}

async function openaiResponse(body) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`OpenAI text generation failed: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

async function generatePost({ topic, internalLinks, existingTitles }) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required. Add it as a GitHub Actions secret before enabling daily posting.");
  }

  const response = await openaiResponse({
    model: TEXT_MODEL,
    instructions: [
      "You are the editorial writer for BrandScout, a practical brand-name availability checker.",
      "Write like a sharp human operator: concrete, plain-spoken, slightly opinionated, never generic.",
      "Avoid AI tells: no 'in today's digital landscape', no hype, no em dashes, no emoji, no filler introductions.",
      "Return only valid JSON. Do not wrap it in markdown.",
    ].join("\n"),
    input: [
      `Date: ${date}`,
      `Website: ${SITE_URL}`,
      `Topic seed: ${topic}`,
      `Allowed categories: ${categories.join(", ")}`,
      `Existing titles to avoid repeating: ${existingTitles.slice(-80).join(" | ")}`,
      "Use 3 to 5 contextual internal links from this pool. Use exact markdown links in the article body:",
      JSON.stringify(internalLinks, null, 2),
      "Create a publish-ready MDX article with this JSON shape:",
      JSON.stringify({
        title: "clear title, 45-70 chars",
        excerpt: "one concise sentence, human and specific",
        category: "one allowed category",
        image_prompt: "editorial hero image prompt, no text, no logos, no UI screenshots",
        content: "# Same title\n\nFull MDX body, 900-1300 words, with H2/H3 headings, short paragraphs, concrete examples, and contextual internal links.",
      }),
    ].join("\n\n"),
  });

  const text = extractOutputText(response);
  const post = parseJson(text);

  if (!post.title || !post.excerpt || !post.category || !post.content || !post.image_prompt) {
    throw new Error("Generated post is missing required fields.");
  }

  return post;
}

function makeSvgHero(title, category, slug) {
  const hue = hashToIndex(slug, 360);
  const accent = `hsl(${hue} 78% 42%)`;
  const accentSoft = `hsl(${(hue + 38) % 360} 72% 88%)`;
  const safeTitle = title.replace(/[<>&"]/g, "");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${safeTitle}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="0.52" stop-color="${accent}"/>
      <stop offset="1" stop-color="#f8fafc"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#020617" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <path d="M0 466 C190 390 330 532 520 468 C710 404 822 284 1048 324 C1120 337 1168 362 1200 388 L1200 630 L0 630 Z" fill="#f8fafc" opacity="0.92"/>
  <g filter="url(#shadow)">
    <rect x="152" y="112" width="448" height="370" rx="34" fill="#ffffff" opacity="0.96"/>
    <rect x="206" y="170" width="210" height="24" rx="12" fill="#0f172a"/>
    <rect x="206" y="228" width="310" height="18" rx="9" fill="#cbd5e1"/>
    <rect x="206" y="268" width="250" height="18" rx="9" fill="#e2e8f0"/>
    <rect x="206" y="334" width="126" height="58" rx="18" fill="${accentSoft}"/>
    <path d="M238 364 L262 386 L304 338" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g filter="url(#shadow)">
    <rect x="676" y="94" width="370" height="304" rx="30" fill="#ffffff" opacity="0.92"/>
    <rect x="716" y="134" width="290" height="54" rx="18" fill="#111827"/>
    <circle cx="746" cy="161" r="7" fill="#22c55e"/>
    <circle cx="770" cy="161" r="7" fill="#f59e0b"/>
    <circle cx="794" cy="161" r="7" fill="#ef4444"/>
    <rect x="732" y="230" width="214" height="18" rx="9" fill="#cbd5e1"/>
    <rect x="732" y="272" width="154" height="18" rx="9" fill="${accentSoft}"/>
    <circle cx="940" cy="280" r="34" fill="none" stroke="${accent}" stroke-width="12"/>
  </g>
  <text x="152" y="548" fill="#0f172a" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">${category}</text>
</svg>`;
}

async function generateImage(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for image generation.");
  }

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt: [
        prompt,
        "Use case: editorial blog hero for a brand naming and domain strategy website.",
        "Style: premium editorial illustration with real material texture, calm workspace energy, no stock-photo cliches.",
        "Composition: wide 3:2 hero, clean focal area, no embedded words, no logos, no UI text, no watermark.",
      ].join("\n"),
      size: "1536x1024",
      quality: "medium",
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.data?.[0]?.b64_json) {
    throw new Error(`OpenAI image generation failed: ${res.status} ${JSON.stringify(data)}`);
  }

  return Buffer.from(data.data[0].b64_json, "base64");
}

async function uniqueSlug(baseSlug) {
  let slug = baseSlug;
  let i = 2;
  while (true) {
    try {
      await fs.access(path.join(CONTENT_DIR, `${slug}.mdx`));
      slug = `${baseSlug}-${i}`;
      i += 1;
    } catch {
      return slug;
    }
  }
}

function frontmatter(post, slug, imageUrl) {
  return `---\ntitle: ${JSON.stringify(post.title)}\ndate: ${JSON.stringify(date)}\nexcerpt: ${JSON.stringify(post.excerpt)}\ncategory: ${JSON.stringify(post.category)}\nimage_url: ${JSON.stringify(imageUrl)}\n---\n\n${post.content.trim()}\n`;
}

async function main() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(IMAGE_DIR, { recursive: true });

  const existingPosts = await getExistingPosts();
  const topic = requestedTopic || topicSeeds[hashToIndex(`${date}:${existingPosts.length}`, topicSeeds.length)];
  const internalLinks = pickInternalLinks(existingPosts, topic);
  const existingTitles = existingPosts.map((post) => post.title);

  if (dryRun) {
    console.log(JSON.stringify({ date, topic, internalLinks, textModel: TEXT_MODEL, imageModel: IMAGE_MODEL }, null, 2));
    return;
  }

  const post = await generatePost({ topic, internalLinks, existingTitles });
  post.category = categories.includes(post.category) ? post.category : "brand-naming";

  const slug = await uniqueSlug(slugify(post.title));
  const pngPath = path.join(IMAGE_DIR, `${slug}.png`);
  const svgPath = path.join(IMAGE_DIR, `${slug}.svg`);
  let imageUrl = `/blog/${slug}.png`;

  try {
    const image = await generateImage(post.image_prompt);
    await fs.writeFile(pngPath, image);
  } catch (error) {
    console.warn(error.message);
    imageUrl = `/blog/${slug}.svg`;
    await fs.writeFile(svgPath, makeSvgHero(post.title, post.category, slug));
  }

  await fs.writeFile(path.join(CONTENT_DIR, `${slug}.mdx`), frontmatter(post, slug, imageUrl));
  console.log(`Created ${slug}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
