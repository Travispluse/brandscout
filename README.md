# BrandScout

Check domain and social media username availability for your brand name — instantly, for free.

## Features

- 🔍 Domain availability across 7 TLDs (.com, .net, .org, .co, .io, .ai, .app)
- 👤 Username checks on GitHub, Reddit, Pinterest, Twitch, Medium, Vimeo
- 💡 Smart name suggestions when your first choice is taken
- 📊 Scoring system (0–100) based on availability, readability, and length
- 📥 Export results as CSV or TXT
- 📝 Blog with guides on branding and domains

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Prisma + SQLite
- Domain checks via RDAP + DNS
- Username checks via HTTP HEAD requests
- MDX blog

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/brandscout.git
cd brandscout
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env`:
```
DATABASE_URL="file:./dev.db"
```

## Daily Blog Automation

The workflow in `.github/workflows/daily-blog.yml` runs once per day and can also be started manually from GitHub Actions. It generates a new local MDX article in `content/blog`, creates a hero image in `public/blog`, verifies `npm run build`, then commits the content back to the default branch.

Required GitHub secret:
```
OPENAI_API_KEY
```

Optional GitHub variables:
```
OPENAI_TEXT_MODEL=gpt-5.2
OPENAI_IMAGE_MODEL=gpt-image-1.5
```

Manual local checks:
```bash
npm run blog:generate:dry-run
npm run blog:generate -- --topic="domain strategy for new service businesses"
```

## No Paid APIs

All checks use free, public methods:
- **Domains**: RDAP protocol (rdap.org) with DNS fallback
- **Usernames**: HTTP HEAD requests to public profile URLs

## Disclaimer

Availability can change quickly. Some platforms restrict automated checks; statuses marked "Unknown" require manual confirmation.

## License

MIT
