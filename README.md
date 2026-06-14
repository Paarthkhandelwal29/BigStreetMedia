# Big Street Media & Advertisers

Marketing website for **Big Street Media & Advertisers** — a PAN-India 360° advertising
agency (est. 2004). Premium, conversion-focused, built to win advertising clients.

🔗 **Live:** https://big-street-media.netlify.app

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Phosphor icons.
Static export — deploys to any static host.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → /out
```

## Deploy (Netlify)

```bash
npm run build && netlify deploy --dir=out --prod
```

## Where things live

| What | Where |
|------|-------|
| Page routes | `app/**` |
| Reusable UI | `components/**` |
| Editable content (services, industries, brands, case studies, portfolio, inventory) | `data/*.ts` |
| Brand & contact details | `lib/site.ts` |
| Route list (sitemap) | `lib/routes.ts` |
| Design tokens | `app/globals.css` (Tailwind v4 `@theme`) |

## Status & resume notes

See [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) for what's built, what's pending,
key decisions, and gotchas. Agent guidance is in [`AGENTS.md`](AGENTS.md).

> Note: imagery (logos, campaign photos, hero video) is **placeholder** until real assets
> are added. Lead forms submit via WhatsApp/email (no backend).
