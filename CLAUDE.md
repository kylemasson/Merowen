# Merowen storefront: notes for Claude Code

Fragrance and grooming house. Next.js 16.3 on Cloudflare Workers (OpenNext), with the Shopify Storefront API for products, cart and checkout. See README.md for setup and deploy, and `design_handoff_merowen_storefront/README.md` for the v4 redesign spec.

## Commands
- `npm run dev`: local dev (uses `.env.local`)
- `npm run check`: type-check + Worker build, the same as CI. Run before every push.
- `npm run preview`: build and run the Worker locally (uses `.dev.vars`)

## Rules
- **Do not upgrade `next`** past 16.3.x without also upgrading `@opennextjs/cloudflare` and confirming `npm run check` passes. 16.4 breaks the Worker.
- Deploys happen automatically from `main` through Cloudflare Workers Builds. Never commit tokens; secrets live in Cloudflare.
- The site must render with no Shopify token (demo fallback in `lib/fallback.ts`). Keep that path working.
- Library images live in `public/media/` and go through `shopifyImage()` in `lib/assets.ts`; a Shopify product image wins when one is set. Bump the `_vNN` suffix when replacing a photo.
- The Cloudflare Worker is named `merowen` (`wrangler.jsonc`). The `previews` block holds public vars for branch preview builds.
- Styling lives in `app/globals.css` as tokens and classes. Don't add inline styles copied from the design prototype.

## Brand rules for any UI or copy change
- Colours (Graphite):
  - Background: Obsidian #0B0B0C.
  - Text: Bone #EDEDEB.
  - Body: Stone #B4B4B1.
  - Captions: Ash #8A8A87.
  - Alt surface: #161618.
  - Hairlines: #2A2A2D.
  - Accent: Pewter #AEB4BB (stored in the `--brass` variable). Highlight: #CFD3D8.
  - Avoid gold or brass tones. No gradients except dark scrims over photos. Square corners, hairline borders.
- Type: Cormorant Garamond (display), Hanken Grotesk (body, UI), IBM Plex Mono (coordinates, codes, prices).
- Signature device: the coordinate line (`components/CoordLine.tsx`), at most one per section.
- Voice: short, concrete, unisex. Never "luxury", "exclusive", "indulge", "clean", "non-toxic".
- Product claims: only what the Merowen Formulation Brief allows. No "antiperspirant", "repairs", "hypoallergenic", "compostable" or "24-hour" until the matching test is passed.
- Physical products: blackened-steel caps, no paper labels (bone ink printed on glass or aluminium), no gold or brass hardware.
