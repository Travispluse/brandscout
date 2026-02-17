// Script to add category frontmatter to blog posts based on filename/content patterns
import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

const categoryMap = {
  'brand-naming': ['brand-name', 'naming', 'creative-brand', 'abstract-vs', 'brand-identity', 'brand-extensions', 'brand-audit', 'brand-architecture', 'brand-awareness', 'brand-consistency', 'brand-voice', 'brand-book', 'brand-personality', 'compound-word', 'acronym-brand', 'foreign-word', 'invented-word', 'one-word', 'portmanteau', 'brand-rename', 'rebrand', 'name-generator', 'brainstorm', 'brand-story', 'name-testing', 'focus-group', 'brand-promise'],
  'domain-strategy': ['domain', 'tld', 'dns', 'whois', 'rdap', 'aftermarket', 'backorder', 'expired-domain', 'premium-domain', 'domain-extension', 'domain-hack', 'domain-parking', 'domain-privacy', 'domain-transfer', 'domain-valuation', 'domain-broker', 'cctld', 'new-gtld', 'blockchain-domain', 'web3'],
  'social-handles': ['username', 'social-media', 'handle', 'bluesky', 'tiktok', 'instagram', 'twitter', 'linkedin', 'threads', 'snapchat', 'youtube', 'pinterest', 'reddit', 'discord', 'facebook'],
  'business-legal': ['trademark', 'copyright', 'legal', 'llc', 'business-registration', 'terms', 'privacy-policy', 'gdpr', 'dmca', 'cease-and-desist', 'brand-protection', 'intellectual-property', 'patent'],
  'ecommerce': ['ecommerce', 'shopify', 'amazon', 'etsy', 'dropship', 'online-store', 'product-naming', 'retail'],
  'industry-guides': ['beauty-brand', 'fitness-brand', 'food-brand', 'restaurant', 'saas-brand', 'tech-startup', 'crypto', 'nft', 'fintech', 'healthtech', 'edtech', 'fashion', 'agency-naming', 'consulting', 'coaching', 'freelance', 'music', 'gaming', 'cannabis', 'pet-brand', 'travel', 'real-estate'],
  'technical': ['api', 'seo', 'analytics', 'ssl', 'cdn', 'hosting', 'dns-setup', 'email-setup', 'google-workspace', 'cloudflare'],
  'branding-strategy': ['brand-strategy', 'brand-positioning', 'target-audience', 'brand-differentiation', 'competitive-analysis', 'brand-equity', 'brand-loyalty', 'brand-perception', 'mission-statement', 'brand-guidelines', 'color-psychology', 'logo', 'visual-identity', 'typography'],
  'growth-marketing': ['marketing', 'growth', 'seo-brand', 'content-marketing', 'social-media-marketing', 'email-marketing', 'influencer', 'affiliate', 'ppc', 'launch', 'pre-launch', 'crowdfund', 'pr-strategy', 'press-release'],
  'guides': ['guide', 'checklist', 'how-to', 'step-by-step', 'best-practices', 'tips', 'mistakes', 'beginner'],
  'advanced-domains': ['premium-domain', 'exact-match', 'keyword-domain', 'geo-domain', 'domain-invest', 'domain-portfolio', 'domain-auction'],
  'platform-guides': ['namecheap', 'godaddy', 'google-domain', 'porkbun', 'cloudflare-registrar', 'squarespace', 'wix', 'wordpress'],
  'emerging-trends': ['ai-', 'trend', '2026', 'future', 'emerging', 'metaverse', 'voice-search', 'chatgpt'],
};

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already has category
  if (raw.includes('category:')) continue;
  
  const slug = file.replace('.mdx', '');
  const lowerSlug = slug.toLowerCase();
  const lowerContent = raw.toLowerCase();
  
  let bestCategory = 'brand-naming'; // default
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    let score = 0;
    for (const kw of keywords) {
      if (lowerSlug.includes(kw)) score += 3;
      // Check title area (first 500 chars)
      if (lowerContent.slice(0, 500).includes(kw)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  // Insert category after excerpt line
  const lines = raw.split('\n');
  let insertIdx = -1;
  let inFrontmatter = false;
  let fmCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      fmCount++;
      if (fmCount === 1) inFrontmatter = true;
      if (fmCount === 2) { insertIdx = i; break; }
    }
  }
  
  if (insertIdx > 0) {
    lines.splice(insertIdx, 0, `category: "${bestCategory}"`);
    fs.writeFileSync(filePath, lines.join('\n'));
  }
}

console.log('Done adding categories to', files.length, 'posts');
