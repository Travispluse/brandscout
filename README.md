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

## No Paid APIs

All checks use free, public methods:
- **Domains**: RDAP protocol (rdap.org) with DNS fallback
- **Usernames**: HTTP HEAD requests to public profile URLs

## Disclaimer

Availability can change quickly. Some platforms restrict automated checks; statuses marked "Unknown" require manual confirmation.

## License

MIT
