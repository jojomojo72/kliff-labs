# Kliff Labs — website

One-stop-shop site for Kliff Labs (web, app, Web3, branding & marketing), built
from the [Kliff Labs web plan](../KliffLabsWebPlan.pdf) in the blockmob.io
design language. Astro (server output, Vercel adapter) + Tailwind. Runs with
zero env vars locally — content falls back to `src/data/*.json`.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Structure

- `/` — kliff.io landing (blue `#2596BE` on `#EBEBEB`)
- `/web3/` — web3.kliff.io section (purple `#8736d9`): crypto styling, Telegram-first
- `/services/` — full service catalogue (anchors: `#web #app #web3 #branding`)
- `/work/` — noir-style work grid, includes unlinked "In progress" projects
- `/blogs/`, `/blogs/[id]` — blog list + posts from `src/data/blogs.json`
- `/lets-talk/`, `/web3/lets-talk/` — contact pages (WhatsApp-first vs Telegram-first)

The blue → purple flip is driven by CSS variables: `Layout.astro` sets
`data-theme="web3"` on `<html>` for `/web3/*` routes and everything
accent-colored (hamburger included) follows. At deploy time, point
`web3.kliff.io` at the `/web3/` routes (host rewrite) or leave it as a path.

## Admin panel

`/admin` manages blogs and projects (same flow as blockmob's admin).

- **Login**: `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars. In dev, if unset, use
  `admin@kliff.io` / `kliff` (never active in production).
- **Storage**: with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` set, content
  lives in Supabase (schema in `supabase/schema.sql`) and publishes instantly.
  Without them, the admin reads/writes `src/data/blogs.json` and
  `src/data/projects.json` directly — dev-only (serverless FS is read-only),
  commit the JSON like code.
- Public pages read the same store, so edits show without a rebuild.

## Edit content here

- `src/data/site.ts` — **contact links are placeholders** (WhatsApp number,
  Telegram/X/Instagram handles, email) — replace before launch
- `src/data/services.ts` — service groups shown in the navbar dropdown (max 4
  each) and on /services
- `src/data/projects.ts` — **placeholder portfolio** — swap in real projects
- `src/data/blogs.json` — blog posts

Fonts (Exo 2, Phudu) are copied from the blockmob project in `public/fonts/`.
