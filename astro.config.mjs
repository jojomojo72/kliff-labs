import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// Server output (same setup as blockmob) so the /admin panel and its API
// routes work, and content edits show without a rebuild. Public pages read
// the content store, which falls back to src/data/*.json when Supabase
// env vars are absent — so `npm run dev` still needs zero config.
// web3.kliff.io maps to the /web3/ routes at deploy time.
export default defineConfig({
  site: 'https://kliff.io',
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
});
