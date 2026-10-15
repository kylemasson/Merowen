# Getting Merowen live

The v4 (Graphite) redesign is built: header with bag drawer, Find your hour, the Range, Field Care with filters, product pages with the mobile buy bar, Dossier code, `/range`, `/about` and `/refill-programme`.

## 1. GitHub
The site lives on `main` at https://github.com/kylemasson/Merowen. Cloudflare Workers Builds deploys every push to `main`; other branches get preview URLs.

## 2. Shopify (about 30 minutes)
1. **Admin → Sales channels → Headless → Create storefront.** Copy the **public access token**.
2. **Settings → Apps → Develop apps → Create app.** Give it the Admin API scopes `write_products`, `write_metaobject_definitions`, `write_metaobjects` and `write_discounts`. Install it and copy the `shpat_…` token.
3. Run:
   ```bash
   npm install
   SHOPIFY_STORE_DOMAIN=1qm0p7-qw.myshopify.com SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/setup-shopify.mjs
   ```
   Add `--dossier-codes=500` once the `postings` collection exists.
4. **Products:** follow README.md, section "Connect Shopify". Use the four Postings with 50/100 ml variants, the `postings` collection, the range handles and the Field Care handles.
5. **Films:** the source files are in `design_handoff_merowen_storefront/design/films/` on the original machine only (they're kept out of git). Convert them first. The commands are in `design_handoff_merowen_storefront/README.md`, section "Films". Then upload under **Content → Files** and pick them in the fields.

## 3. Cloudflare
Your repo notes say deploys already run automatically from `main` through Workers Builds. If that's not set up yet:
1. Run `npx wrangler login`, then `npx wrangler secret put SHOPIFY_STOREFRONT_ACCESS_TOKEN` and paste the Headless token.
2. Dashboard → **Workers & Pages → merowen → Settings → Build → Connect** the GitHub repo `kylemasson/Merowen`, branch `main`.
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
3. **Domains & Routes → Add** `merowen.com`.

Each push to a branch builds a preview. Merging to `main` puts it live.

## What changed on 15 Oct
- New bottle design (v05) across all posting, range, hero and wearers imagery, plus six films in `design_handoff_merowen_storefront/design/films/`.
- New product FC/10 Peptide Cream in `lib/fieldcare.ts`.
- Footer now reads Park City, Utah.
- The drawn bottle (`components/Bottle.tsx`) matches the new design.
- Field Care FC/01–FC/10 and the ritual shot regenerated in the new vessel language (`_v05.jpg`).
- Provenance block on posting pages (new metafields: perfumer, source, producer, composed_in, bottled_in, batch). Fill the [TBC] values in Shopify or lib/fallback.ts.
- Origin wording is "Composed in Park City, Utah" everywhere; see the handoff README before using "Made in the USA".
