import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-static';

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm: Record<string, string> = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) fm[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
  });
  return fm;
}

export async function GET() {
  const blogDir = join(process.cwd(), 'content', 'blog');
  const files = readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
  
  const posts = files.map(f => {
    const content = readFileSync(join(blogDir, f), 'utf8');
    const fm = parseFrontmatter(content);
    return {
      slug: f.replace('.mdx', ''),
      title: fm.title || f.replace('.mdx', ''),
      excerpt: fm.excerpt || fm.description || '',
      date: fm.date || '2026-01-01',
      category: fm.category || '',
    };
  }).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);

  const items = posts.map(p => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>https://brandscout.net/blog/${p.slug}</link>
      <guid>https://brandscout.net/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
      <category>${p.category}</category>
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BrandScout Blog</title>
    <link>https://brandscout.net/blog</link>
    <description>Expert insights on brand naming, domain strategy, and building your online presence.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://brandscout.net/feed" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
