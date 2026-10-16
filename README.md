# Merowen storefront · v9

The Merowen site, built from the Graphite design handoffs (v4 layouts, v9 Park City + London rebrand in
`design_handoff_merowen_v9/`). Next.js 16.3 on Cloudflare Workers (OpenNext), with the
Shopify Storefront API for prices, cart and checkout.

You can tell v9 is live by the footer (`SITE V9`) or the `merowen-site-version` meta tag.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000, reads .env.local
npm run check      # Worker build + type-check (run before every push)
npm run preview    # build and run the Worker locally, reads .dev.vars
npm run deploy     # build and deploy the `merowen` Worker
```

Copy `.dev.vars.example` to `.dev.vars` (Worker) or `.env.local` (next dev) to set values locally.

## Demo mode and Shopify

With no `SHOPIFY_STOREFRONT_ACCESS_TOKEN` the site runs on the catalogue in `lib/catalog.ts` and a
demo bag kept in a cookie: adding, quantities and the Dossier code all work, and Checkout explains
that the shop is not connected yet.

Add the token to the Worker to go live:

```bash
npx wrangler secret put SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

Then prices, variants and checkout come from Shopify, matched by product handle:
`blackfriars`, `guardsman`, `mayfair`, `empire`, `the-dossier`, `blackfriars-extrait`, `the-field-kit`,
`the-refill`, and the Field Care handles in `lib/catalog.ts`. A posting film set in the
`merowen.film` metafield plays on its product page. `scripts/setup-shopify.mjs` creates the
metafields and the Dossier discount (see the handoff README).

`NEWSLETTER_WEBHOOK_URL` (secret) receives Inner Circle sign-ups as JSON. Without it the form says
sign-ups are not open yet.

## Layout

- `app/`: routes (`/`, `/range`, `/field-care`, `/products/[handle]`, `/about`, `/refill-programme`, `/cart`) and server actions in `app/actions.ts`.
- `components/`: header, bag drawer, hero, Find your hour, product media and buy block.
- `lib/catalog.ts`: all copy and imagery. `lib/shopify.ts`, `lib/offers.ts`, `lib/bag.ts`: Shopify and the bag.
- `public/media/`: the kit photography (v08 posting masters and boxes, v09 wearers band, v05 Range and Field Care).
- `public/film-files/` (served with Range support by `app/films/[name]/route.ts`): the kit's v08e hero and v09 posting films re-encoded for the web (H.264, fast start) with macOS `avconvert -p Preset1920x1080`. They play muted on the home hero (desktop) and the four posting pages. Phones get the v08 still cropped onto the flacon until a mobile hero film exists. A `merowen.film` set in Shopify overrides a posting's film.
- `app/globals.css`: every colour, type size and layout rule.

## Deploy

The Worker is named `merowen` (`wrangler.jsonc`). Deploy by hand with `npm run deploy`, or connect
Workers Builds to `kylemasson/Merowen` on `main` with build command `npx opennextjs-cloudflare build`
and deploy command `npx opennextjs-cloudflare deploy`.
