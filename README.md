# Merowen Storefront

The Merowen website: a Next.js app on **Cloudflare Workers**, with **Shopify** as the back end for products, content, cart and checkout.

| Piece | What | Where |
| --- | --- | --- |
| Front end | Next.js 16.3 (App Router, React 19, server actions) | this repo |
| Hosting | Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare) | Worker `merowen` |
| Commerce | Shopify Storefront API `2026-07`; checkout runs on Shopify | `1qm0p7-qw.myshopify.com` |
| Images | `public/media/` (served as Worker static assets); Shopify product images win when set | `lib/assets.ts`, `lib/fieldcare.ts` |
| CI | GitHub Actions: build the Worker + type-check on every push and PR | `.github/workflows/ci.yml` |

The site runs on built-in demo content until a Storefront token is set, so it always renders.

---

## Status

**Done**
- Shopify content model: `merowen.*` product metafields, `home_page` metaobject (entry `home`), collections `postings`, `range` and `field-care`
- 17 products in Shopify as **drafts**, with photos, prices, variants and posting metafields
- Store domain set in `wrangler.jsonc`

**To go live** (each needs your Shopify or Cloudflare login)
1. [Shopify Storefront token](#1-shopify-storefront-token)
2. [Connect this repo to Cloudflare](#2-connect-cloudflare)
3. [Publish the products](#3-publish-the-products)
4. [Attach the domain](#4-attach-the-domain)

---

## 1. Shopify Storefront token

1. Shopify admin → **Settings → Apps and sales channels → Shopify App Store** → install the free **Headless** channel.
2. **Sales channels → Headless → Create storefront.**
3. Under **Storefront API**, copy the **public access token**. It is safe in a browser, but we still keep it as a secret.
4. Keep this page open; you'll paste the token into Cloudflare in step 2.

## 2. Connect Cloudflare

Cloudflare builds and deploys from GitHub on every push to `main`. Use **Workers Builds** (below), not a second deploy pipeline.

1. Cloudflare dashboard → **Workers & Pages → `merowen` → Settings → Build → Git repository → Connect** → choose `kylemasson/Merowen`, branch `main`. (New account? **Create → Import a repository** instead.)
2. Build settings:
   - Worker name: `merowen` (must match `name` in `wrangler.jsonc`)
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
   - Non-production branch deploy command: `npx opennextjs-cloudflare upload` (preview URLs for pull requests)
   - Root directory: `/`
3. Deploy. The site comes up at `merowen.<your-subdomain>.workers.dev`, running on demo content.
4. **Settings → Variables and Secrets → Add → Secret**: `SHOPIFY_STOREFRONT_ACCESS_TOKEN` = the token from step 1. Redeploy.
5. Optional: add `SITE_URL` (e.g. `https://merowen.com`) as a variable once the domain is attached, and `NEWSLETTER_WEBHOOK_URL` as a secret for the Inner Circle form.

The public variables (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_API_VERSION`, `SHOPIFY_POSTINGS_COLLECTION`) already live in `wrangler.jsonc`, so every deploy carries them.

## 3. Publish the products

The Storefront API only returns products that are **Active** and **published to the Headless channel**.

1. Shopify admin → **Products** → select the 17 Merowen products → **Set as active**.
2. With them selected → **More actions → Include in sales channels → Headless**.
3. Do the same for the three collections (`The Postings`, `The Range`, `Field Care`).

Until then the site shows the built-in postings and range, and checkout is disabled.

## 4. Attach the domain

Cloudflare → the Worker → **Settings → Domains & Routes → Add → Custom domain** → `merowen.com` (the domain's DNS must be on Cloudflare). Then set `SITE_URL` to match so the sitemap and social previews use it.

---

## Run it locally

Requires Node 22 (`.nvmrc`).

```bash
npm ci
cp .dev.vars.example .env.local   # for `npm run dev`
cp .dev.vars.example .dev.vars    # for `npm run preview` (real Workers runtime)
npm run dev                        # http://localhost:3000
npm run preview                    # build the Worker and run it locally
npm run check                      # what CI runs: type-check + Worker build
```

Put the Storefront token in `.env.local` / `.dev.vars` to see live Shopify data. Both files are git-ignored.

## Configuration

| Variable | Kind | Value |
| --- | --- | --- |
| `SHOPIFY_STORE_DOMAIN` | var (`wrangler.jsonc`) | `1qm0p7-qw.myshopify.com` |
| `SHOPIFY_API_VERSION` | var | `2026-07` |
| `SHOPIFY_POSTINGS_COLLECTION` | var | `postings` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | **secret** | from the Headless channel |
| `SITE_URL` | var (optional) | `https://merowen.com` once attached |
| `NEWSLETTER_WEBHOOK_URL` | secret (optional) | Klaviyo / Shopify Flow / Zapier webhook |

Never commit tokens. To rebuild the Shopify content model on a new store: `SHOPIFY_STORE_DOMAIN=… SHOPIFY_ADMIN_TOKEN=shpat_… node scripts/setup-shopify.mjs`.

## Films and sound

Every film slot is a field in Shopify; upload a file and the site uses it on the next page load, with no code change or redeploy.

| Slot | Where in Shopify | Export spec |
| --- | --- | --- |
| Hero film, desktop | Metaobject `home_page` → `hero_film_desktop` | 1920×1080, MP4 H.264, 24 fps, 8–20 s seamless loop, no audio |
| Hero film, mobile | `hero_film_mobile` | 1080×1920, same cut |
| Hero poster | `hero_poster` | first frame, 2400 px (until set, the site uses `public/media/merowen_brand_hero_v05.jpg`) |
| Hero soundtrack | `hero_audio` | MP3 320 kbps, 48 kHz, about −16 LUFS, same length as the loop |
| Posting film | product metafield `merowen.film` | 1080×1350 (4:5), 6–10 s loop, no audio |
| Posting poster | `merowen.film_poster` | first frame |

## Project map

```
app/
  layout.tsx               fonts, header (bag drawer, menu), footer, toasts
  page.tsx                 home: hero, postings + Find your hour, range, proof, Field Care, wearers band, Inner Circle
  products/[handle]/       product pages (postings, range, Field Care) with the mobile buy bar
  range/, field-care/      the full range; the Field Care line with step filters
  about/, refill-programme/
  cart/                    bag page (the no-JavaScript fallback for the drawer)
  actions.ts               server actions: add to bag, quantities, checkout, newsletter
  sitemap.ts, robots.ts    SEO
components/                Header, BagDrawer, HeroFilm, FindYourHour, ProductBuy, ProductMedia, Cards, CoordLine…
lib/shopify.ts             Storefront API client, queries, mapping, demo fallback
lib/fieldcare.ts           Field Care product data (formula copy, free-from lists, images)
lib/assets.ts              photography library (public/media)
lib/fallback.ts            demo postings and range used until Shopify is live
scripts/setup-shopify.mjs  creates metafield + metaobject definitions
public/media/              v05 photography used across the site
design_handoff_merowen_storefront/  the v4 design spec and prototype (films are kept out of git)
```

## Notes

- **Next.js is pinned to 16.3.8.** OpenNext 1.20.11 crashes on Next 16.4 (`Unexpected loadManifest(/.next/server/preview-props.json)`). Upgrade Next and `@opennextjs/cloudflare` together and let CI confirm; Dependabot is set to skip Next minor and major versions.
- Pages render on request so prices and stock are always live. To add caching later, attach an R2 bucket and enable the OpenNext R2 incremental cache.
- Replace every `[PLACEHOLDER]` in the copy (natural-origin %, certifications, contact email) with confirmed facts before launch. Product claims follow the Merowen Formulation Brief.
