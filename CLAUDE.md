# Merowen storefront v9: notes for Claude Code

Fragrance and grooming house. Next.js 16.3 on Cloudflare Workers (OpenNext), Shopify Storefront API for prices, cart and checkout. See README.md for setup and deploy, and `design_handoff_merowen_v9/README.md` for the design spec.

## Commands
- `npm run dev`: local dev (uses `.env.local`)
- `npm run check`: Worker build + type-check. Run before every push.
- `npm run deploy`: build and deploy the `merowen` Worker.

## Rules
- **Do not upgrade `next`** past 16.3.x without also upgrading `@opennextjs/cloudflare` and confirming `npm run check` passes.
- Never commit tokens; secrets live in Cloudflare (`wrangler secret put`).
- The site must render and the bag must work with no Shopify token (demo mode in `lib/bag.ts` and `lib/offers.ts`). Keep that path working.
- Copy and imagery live in `lib/catalog.ts`; photos in `public/media/`. Bump the `_vNN` suffix when replacing a photo.
- Styling lives in `app/globals.css` as tokens and classes. No inline styles except data-driven colours (scent swatches, rail positions).
- Postings: Blackfriars 01 (23:00, London), Guardsman 02 (06:00, Park City), Mayfair 03 (17:00, London), Empire 04 (20:00, Park City). Mountain postings say "From"; city postings say "Composed for". Material origin is stated separately.
- The visible version marker (footer `SITE V9`, `SITE_VERSION` in `lib/site.ts`) changes with each rebuild.

## Brand rules for any UI or copy change
- Colours (Graphite): Obsidian #0B0B0C background, Bone #EDEDEB text, Stone #B4B4B1 body, Ash #8A8A87 captions, #161618 alt surface, #2A2A2D hairlines, Pewter #AEB4BB accent (the `--brass` variable), #CFD3D8 highlight. No gold or brass tones. No gradients except dark scrims over photos. Square corners, hairline borders.
- Type: Cormorant Garamond (display), Hanken Grotesk (body, UI), IBM Plex Mono (coordinates, codes, prices).
- Signature device: the coordinate line (`components/CoordLine.tsx`), at most one per section.
- Voice: short, concrete, unisex. Never "luxury", "exclusive", "indulge", "clean", "non-toxic".
- Product claims: only what the Merowen Formulation Brief allows. No "antiperspirant", "repairs", "hypoallergenic", "compostable" or "24-hour" until the matching test is passed.
- Origin: "Composed in Park City, Utah". Never "Made in the USA".
