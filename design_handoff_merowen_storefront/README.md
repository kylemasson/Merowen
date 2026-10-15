# Handoff: Merowen Storefront v4 (Graphite)

Target repo: `kylemasson/Merowen` (branch `main`, inspected at commit `781f19413ba7`).
Stack in repo: Next.js 16.3.8 App Router · React 19.3 · `@opennextjs/cloudflare` 1.20.11 · Shopify Storefront API (`lib/shopify.ts`) · checkout on Shopify.

## Overview

The repo already works end to end: products, films, cart (cookie `merowen_cart`) and the checkout redirect go through Shopify. **Do not rewrite it.** This handoff covers four things:

1. Re-skin to the **Graphite** palette and the v4 layouts.
2. Add the v4 features: bag drawer, Dossier code, sticky mobile buy bar, Find your hour, Refill Programme page, `/range`, `/about`.
3. Add the missing deploy and setup files (`wrangler.jsonc`, `.dev.vars.example`, `scripts/setup-shopify.mjs`). The repo's README references them, but they aren't in the tree, so `npm run deploy` currently fails.
4. Apply the accessibility fixes: focus rings, Esc to close, focus trap, Pause control.

## About the design files

`design/Merowen Storefront v4.dc.html` is an **HTML design reference**: a single-file prototype showing the intended look and behaviour. It is not production code. To view it, open it in a browser with `support.js` and `assets/` next to it. Navigation uses hash routes (`#/`, `#/range`, `#/p/mirbat`, `#/field-care`, `#/about`, `#/refill-programme`), and the bag opens from the header.

Rebuild the screens in the repo's existing patterns: server components, server actions, the `globals.css` classes and the existing components. **Do not paste the prototype's inline styles in.** Where the design uses a value, put it in `globals.css` as a token or class.

## Fidelity

**High fidelity.** The colours, type, spacing, copy and interactions are final, except for the items listed under *Open decisions*. All corners are square (radius 0), and there are no shadows anywhere.

## Design tokens: migrate `app/globals.css`

Keep the variable names (they're used everywhere) and change their values:

| Token | Old | **New (Graphite)** | Use |
|---|---|---|---|
| `--obsidian` | #0d0e0b | **#0B0B0C** | page background |
| `--moss` | #1a1d16 | **#161618** | alt section bg, image wells, inputs |
| `--hairline` | #23251f | **#2A2A2D** | 1px rules, borders |
| `--rule` | #3a3c33 | **#3A3A3E** | stronger rule |
| `--bone` | #e9e3d6 | **#EDEDEB** | primary text |
| `--stone` | #b5ae9f | **#B4B4B1** | body text |
| `--ash` | #8c8574 | **#8A8A87** | captions, eyebrows, ghost borders |
| `--vellum` | #d9c9a6 | **#CFD3D8** | italic emphasis in headlines, focus ring |
| `--brass` | #c9a66b | **#AEB4BB** | accent: primary button, active states, seal ring, header dot |
| `--brass-hi` | #e6cfa0 | **#CFD3D8** | primary button hover |

You may rename `--brass` to `--pewter` in a follow-up. The brand book says no gold or brass hardware.

Other places that hard-code the old colours:
- `app/layout.tsx`: `themeColor: "#0B0B0C"`.
- `components/Seal.tsx`: defaults to `ring="#AEB4BB"` and `mark="#EDEDEB"`.
- `lib/shopify.ts` `mapProduct`: the liquid fallback becomes `#5E4636`.
- `lib/fallback.ts`, liquid colours: Mirbat `#5E4636`, Azrou `#6F6553`, Torbeck `#46483F`, Kilda `#5A646A`. Use the same values in each product's `merowen.liquid_color` metafield in Shopify.

**Type.** The fonts are already self-hosted through `@fontsource`.
- Display: Cormorant Garamond 300; italic 300 for `<em>`.
  - H1: `clamp(52px, 5.6vw, 96px)`, line-height .98.
  - H2: `clamp(40px, 5vw, 72px)`, line-height 1.
  - Product names: uppercase, tracking .08em.
- Body: Hanken Grotesk 300, 15–17px, line-height 1.7, colour `--stone`.
- Eyebrows: Hanken Grotesk 500, 11px, tracking .32em, uppercase, colour `--ash`.
- Codes, prices and coordinates: IBM Plex Mono 400, 12px, tracking .10–.12em.

**Buttons.**
- Primary: 52px tall, padding 0 28px, Hanken Grotesk 500 11px with tracking .26em, uppercase. Background `--brass`, text `--obsidian`; on hover the background becomes `--brass-hi`.
- Ghost: the same size, transparent, with a 1px `--ash` border; on hover the border becomes `--bone`.

**Layout.**
- Content max width 1320px (the hero allows 1440px). Gutter: `clamp(20px, 5vw, 64px)`.
- Section vertical padding: `clamp(80px, 11vw, 152px)`.
- The narrow breakpoint is **760px**. Below it, the layout is one column, the hero switches to the portrait still and the buy bar appears.

**Focus.** `:focus-visible { outline: 1px solid var(--vellum); outline-offset: 3px }`. Never remove the outline without replacing it.

## Screens and changes, mapped to repo files

### Header (`components/Header.tsx`)
- The lockup becomes **seal · MEROWEN**: `<Seal size={32}/>`, then a middle dot (`·`, Cormorant 19px, colour `--brass`, `aria-hidden`), then the wordmark (Cormorant 400 19px, tracking .42em).
- The Bag link opens the **bag drawer** (see Cart). Keep `/cart` as the fallback when JavaScript is off.
- Nav items: Postings, Range (`/range`), Field Care, About (`/about`), Bag (n). Proof and Origins drop out of the nav; see *Open decisions*.

### Home (`app/page.tsx`)
Section order in v4: Hero → Postings (with Find your hour) → The Range → Field Care → Wearers band → The Inner Circle.

- **Hero (`HeroFilm.tsx`).** The behaviour already matches v4. Change three things:
  - Show the Pause/Play control whenever motion is running, including when a still is slowly zooming. Pausing freezes the still's zoom where it is; it doesn't snap back.
  - Controls sit bottom-right on desktop and at the top right (88px from the top) on narrow screens. Each control is 44px tall, with a 1px `--ash` border, a `rgba(11,11,12,.55)` background and Plex Mono 11px uppercase text.
  - The headline is `Composed in the wild. <em>Worn in the dark.</em>`. The copy block is at most `min(560px, 42vw)` wide, so it never overlaps the bottle. Between 760 and 1200px the still's `object-position` is `100% 50%`.
- **Find your hour (`PostingSelector.tsx`).** Below the 24-hour rail, add a range input (0–24, step 1) that starts at the visitor's local hour. A 1px `--brass` marker on the rail follows it. The posting that covers that hour is highlighted, and a link appears: `POSTING 0n` (mono) followed by the name (Cormorant 26px) and the italic line.
  - **Rule:** use the latest posting whose hour is at or before the selected hour; if none, wrap round to the last one. Order: Azrou 06, Torbeck 17, Kilda 20, Mirbat 23.
  - Hovering a card overrides the highlight.
  - The input needs `aria-label="Find your hour"` and `aria-valuetext="HH:00"`.
- **The Range (`Sections.tsx` → `Range`).** The heading reads `Discover. Wear. Carry. <em>Keep.</em>`, with a ghost button `The full range` linking to `/range`.
  - Four square cards, each showing: image, tag (mono, `ROLE · FORMAT`, e.g. `DISCOVER · 4 × 2 ML`), name (Cormorant 28px uppercase), description and price.
  - Extrait and Field Kit get an `In preparation` label (top left, background `--obsidian`).
- **Field Care teaser.** Use a grid of four 4:5 product cards: Aftershave Balm, Shampoo, Basalt Face Wash and Deodorant. Each caption is `FC/0n · NAME` with an 8px square in that product's scent colour.
  - **Do not use `merowen_care_lineup_v03.png`** anywhere. It shows products that aren't in the line (Body Wash, Face Cream, Eye Cream, Beard Oil).
- **Wearers band.** Full-bleed `merowen_brand_wearers_v01`, `object-position: 50% 70%`, with the headline `Leave a trace, <em>not a trail.</em>`.
- **The Inner Circle (`InnerCircle.tsx`).**
  - Eyebrow: `The Inner Circle`. Headline: `First word, <em>before the shelf.</em>`. Body: `New postings, numbered Extrait batches and refill reminders. Sent rarely.`
  - Form: an email field with a bottom border only, and a `Join` button in `--brass` text. It uses the existing `subscribe` action.
  - The footer shows this form on every page except home.

### Product page (`app/products/[handle]/page.tsx`, `PostingDetail.tsx`, `CareDetail.tsx`, `VariantBuy.tsx`)
- **Layout.**
  - From 760px up: two columns, `minmax(0,1.1fr) minmax(0,1fr)`, with the media column sticky at `top: 96px`.
  - Below 760px: one column.
- **Posting media.** A 4:5 frame.
  - If `merowen.film` is set, motion is allowed and the visitor hasn't paused it, play the film: muted, looped, inline, with `poster` set to the still. A Pause/Play control sits bottom-right.
  - Otherwise show the image gallery: posting still, then the extras, then `merowen_pack_box`.
- **Posting copy.** Use the brand-book stories, which `fallback.ts` already has.
  - Sizes: `50 ml $195` and `100 ml $285`. The prices come from Shopify variants; these values are for demo mode only.
  - Note under the button: `Began with the Dossier? Enter the code from its card in the bag.`
- **Details accordion.**
  - *The flacon*: Heavy-base glass; solid blackened-steel cap in satin gunmetal, knurled like a dive-watch crown, over a slim steel neck collar engraved with posting, hour, batch and date. No paper label: the name is printed on the glass and the coordinates are etched into the base.
  - *The box*: Uncoated black FSC board, blind-debossed seal, coordinate line printed in bone ink, magnetic close. No foil, no plastic insert.
  - Then *Shipping and returns*.
- **Range products.**
  - Dossier note: `Arrives with a single-use code that credits the price toward your first flacon.`
  - The Refill links to `/refill-programme` with the label `How the programme works`.
- **Field Care products.** Show these specs: Step, Scent (with a swatch), Size, Key ingredients, Vessel. Under them, list *Also for {step}*: the other products in the same step.
- **Sticky buy bar (new, mobile only).** Show it when the screen is narrower than 760px, the main buy block is out of view (use an IntersectionObserver on the buy block), and neither the drawer nor the menu is open.
  - Fixed to the bottom with padding `12px 16px calc(12px + env(safe-area-inset-bottom))`, background `--obsidian`, 1px `--hairline` top border.
  - Left side: name (Cormorant 20px uppercase, ellipsis) and sub-line (mono 11px, e.g. `EDP · 50 ML`).
  - Right side: a primary button `Add — $195`, 48px tall.
  - Add an 80px spacer at the end of the page, and move toasts up to `bottom: 96px` while the bar shows.

### Field Care (`app/field-care/page.tsx`)
- **Remove the line-up hero image.** Open with just the eyebrow and headline `The kit <em>behind the scent.</em>`, then step filter chips (All · Shave · Hair · Skin · Body) and the product grid.
- After the grid, add a two-column block: the `merowen_care_ritual_v05` image (16:9) next to the copy.
  - Eyebrow: `The morning shave`. Headline: `A close shave <em>before first light.</em>`.
  - Body: `Shave Cream in Azrou, Aftershave Balm in Mirbat, Aftershave Tonic in Kilda.`
  - A ghost button `Shop the shave` sets the filter to Shave.
- The ritual photo shows the Shave Cream labelled 100 ml; the spec is 150 ml. Regenerate the photo before launch.

### `/range` (new route)
Heading `Discover. Wear. Carry. Keep.`, then the same four cards as on home, at full width.

### `/about` (new route)
The name story and the pillars from the design file, plus a **Packaging** section: the `merowen_pack_box` image (1:1) next to `Made <em>to be kept.</em>` and a list of four rows:
- **Flacon:** Heavy-base glass; solid blackened-steel cap in satin gunmetal, knurled like a dive-watch crown, over a slim steel neck collar engraved with posting, hour, batch and date.
- **Outer box:** Uncoated black FSC board, blind-debossed seal, coordinate line printed in bone ink, magnetic close. No foil, no plastic insert.
- **Field Care:** Obsidian glass or black aluminium, blackened-steel caps and pumps, refillable steel deodorant case.
- **Rule:** No gold or brass hardware, no paper labels, no foil.

### `/refill-programme` (new route)
- **Hero:** two columns.
  - Eyebrow: `The Refill Programme`. H1: `Kept <em>for life.</em>`.
  - Body: `Every flacon is made to be refilled. There is a 200 ml flask for every posting, and the empty comes back to us.`
  - Primary button `The Refill — $395`, plus the refill image (1:1).
- **Three steps**, on a `--moss` band, each with a mono number:
  - 01 Choose your posting: Order the 200 ml Refill flask in Mirbat, Azrou, Torbeck or Kilda.
  - 02 Refill the flacon: **[method TBC]**.
  - 03 Return the empty: Send the empty flask back with your next order. **[return label / credit TBC]**.
- **Deodorant block:** a link to the deodorant product, with `The case <em>refills too.</em>` and `CASE $58 · REFILL $22`.
- Footer link: `The Refill Programme`.

### Cart: drawer, with `/cart` as the fallback (`app/cart/page.tsx`, `app/actions.ts`)
- **Drawer.** A panel on the right, 440px wide (full width under 760px), with `role="dialog"`, `aria-modal="true"` and `aria-label="Bag"`.
  - Lines show quantity steppers and use the existing `changeQuantity` action.
  - A Dossier code field sits above the subtotal (see below).
  - The checkout button submits `goToCheckout`.
- **Behaviour shared by the drawer and the mobile menu:**
  - Opening moves focus to the first button inside.
  - Tab and Shift+Tab stay inside the panel; Esc closes it.
  - The page behind can't scroll while it's open.
  - Closing returns focus to the button that opened it.
  - Changing route closes it.
- Adding to the bag opens the drawer instead of showing a toast. The `addToCart` action stays the same.

## Dossier credit (new)

**Decision used in the design:** each Dossier ships with a printed card carrying a **single-use Shopify discount code**. The shopper types it into the bag, and Shopify applies it.

- **Shopify side:** a single discount, `Dossier credit`.
  - $38 off, applied once per order, and only when the order includes a product from the `postings` collection.
  - Usage limit 1, once per customer.
  - It holds a bulk batch of codes (for example 500) that are printed on the cards.
  - `scripts/setup-shopify.mjs --dossier-codes=500` creates it; check the mutation fields against the current Admin API docs before running it.
- **Storefront side:**
  - Add `discountCodes { code applicable }` and `cost { totalAmount { amount currencyCode } }` to `CART_FIELDS` in `lib/shopify.ts`, and add `cart.discountCodes` / `cart.total` to the `Cart` type.
  - New function `updateDiscountCodes(cartId, codes: string[])` using the `cartDiscountCodesUpdate(cartId, discountCodes)` mutation.
  - New server action `applyDossierCode(prev, formData)`. It upper-cases and trims the input, checks it against `^[A-Z0-9-]{6,}$`, then calls `updateDiscountCodes`, and `revalidatePath("/", "layout")`.
  - `removeDossierCode()` calls `updateDiscountCodes(cartId, [])`.
- **UI states, all in Hanken Grotesk 300 13px `--stone`:**
  - Empty: an input `Dossier code` (mono uppercase) with an `Apply` button.
  - Invalid format: `That code does not look right. It is printed on the card inside your Dossier.`
  - Code saved but `applicable: false`: `Saved. The credit applies once a 50 or 100 ml Posting is in the bag.`
  - Applied: a `Dossier credit` row showing `CODE · REMOVE` and `−$38` in mono.
- The note inside the bag when a Dossier is in it: `Your Dossier arrives with a single-use code worth $38 toward a 50 or 100 ml Posting.`

## Cloudflare

Copy `deploy/wrangler.jsonc` and `deploy/.dev.vars.example` from this bundle to the repo root, then:

```bash
npx wrangler login
npx wrangler secret put SHOPIFY_STOREFRONT_ACCESS_TOKEN
npm run deploy
```

- **Domain:** Cloudflare dashboard → Workers → `merowen-storefront` → Domains & Routes → add `merowen.com`.
- **Automatic deploys:** Settings → Builds → connect the repo. Build command: `npx opennextjs-cloudflare build`. Deploy command: `npx opennextjs-cloudflare deploy`.
- **Caching:** leave it off at launch. Pages are `force-dynamic` and the Storefront API is fast. In phase 2, add an R2 incremental cache, switch the queries to `revalidateTag`, and add `/api/shopify-webhook`, which verifies `X-Shopify-Hmac-Sha256` and revalidates on `products/update`.

## Shopify

1. **Headless channel.** Create a storefront and copy its public token into `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
2. **Custom app (Admin API).** Grant `write_products`, `write_metaobject_definitions`, `write_metaobjects` and `write_discounts`. Run:
   ```bash
   SHOPIFY_STORE_DOMAIN=1qm0p7-qw.myshopify.com SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/setup-shopify.mjs
   ```
   This creates the `merowen.*` product metafields and the `home_page` metaobject, all readable by the storefront.
3. **Products:**
   - Postings: `mirbat`, `azrou`, `torbeck`, `kilda`, each with `50 ml` / `100 ml` variants, in the collection `postings`.
   - Range: `the-dossier`, `mirbat-extrait`, `the-field-kit`, `the-refill`.
   - Field Care: one product per handle in `lib/fieldcare.ts`. The Deodorant has variants Case / Refill.
4. **Home metaobject:** one entry with handle `home`.
5. **Files:** upload the films, poster and audio to Content → Files, then select them in the fields.

## Films (Higgsfield v01): transcode before uploading
`design/films/` holds six silent loops: `merowen_hero_film_desktop_v01.mp4` (16:9), `merowen_hero_film_mobile_v01.mp4` (9:16), and `merowen_film_{mirbat,azrou,torbeck,kilda}_v01.mp4` (3:4).

As delivered they are **HEVC with the moov atom at the end of the file**. They won't play in Firefox or on many Chrome and Android builds, and they can't start playing before the whole file has downloaded. Transcode every file before uploading it to Shopify:

```bash
# hero cuts
ffmpeg -i merowen_hero_film_desktop_v01.mp4 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -an hero_desktop.mp4
ffmpeg -i merowen_hero_film_mobile_v01.mp4  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -an hero_mobile.mp4
# posting films: crop 3:4 → 4:5 (centre), then encode
ffmpeg -i merowen_film_mirbat_v01.mp4 -vf "crop=iw:trunc(iw*5/4/2)*2" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -an film_mirbat.mp4
```

Repeat the posting command for Azrou, Torbeck and Kilda. Then upload the files to Content → Files and select them:
- `hero_film_desktop` and `hero_film_mobile` on the `home_page` metaobject.
- `merowen.film` on each Posting product.

Shopify also transcodes uploads, so `toFilm()` in `lib/shopify.ts` will pick its MP4/WebM renditions.

**Production fallback (required).** Add `onError` to every `<video>` (`HeroFilm.tsx`, the posting media). When it fires, switch to the poster or still image. Never leave a black frame.

## Accessibility checklist
- Every interactive element shows a visible focus ring.
- Every hit area is at least 44px.
- Esc closes the drawer and the menu, and focus is trapped while either is open.
- Any motion longer than 5 seconds has a Pause control. `prefers-reduced-motion` shows posters and stills only.
- Text meets 4.5:1 contrast. `--ash` (#8A8A87) on `--obsidian` is about 5.3:1; don't use anything dimmer for text.

## Open decisions (ask the owner, don't guess)
1. **Field Care data:** the repo's `lib/fieldcare.ts` and the brand book differ. Ingredients: the repo has richer lists. Options: the repo has scent / Unscented variants, while the design has Case / Refill for the Deodorant. Packaging: the repo puts Shampoo and Conditioner in aluminium, the design in glass. The Night Oil line differs too. **Keep the repo's data** unless the owner says otherwise.
2. **Home sections the design doesn't include:** Marquee, Manifesto, Proof, Elements, Origins and Ritual from `Sections.tsx`. Keep them, move them to `/about`, or cut them?
3. **Refill steps 02 and 03:** waiting on details from production.
4. **Copy written for the design:** the Inner Circle text, the Refill Programme copy, the bag code messages and the morning-shave line all need sign-off.

## Bottle v05 (approved)
The flacon was redesigned on 15 Oct 2026. All `_v05` imagery and films use it. Spec, for product pages and the About packaging list:
- **Glass:** extra-clear flint, chamfered vertical edges cut like a gemstone; the lower third is opaque matte black glass fading up into clear; ~25 mm solid base.
- **Cap:** tall solid blackened steel, satin gunmetal, knurled like a dive-watch crown, domed top with the M seal engraved.
- **Collar:** slim steel neck collar engraved with posting, hour, batch and date.
- **Lettering:** raised bone-white ink printed on the glass. MEROWEN large, a short hairline, then the posting name small beneath. Coordinates etched into the base edge.
- Update the *The flacon* accordion copy and the About packaging *Flacon* row to this spec. `components/Bottle.tsx` already matches.

## Fine print
The brand is based in **Park City, Utah** (40.6461° N, 111.4980° W). Use it in the footer legal line, the About page and any legal copy. Drop "Maison de Parfum" from the footer legal line (the hero eyebrow can keep it for now; owner to confirm).

## Provenance block (posting pages)
Under the notes on every posting page: eyebrow *Provenance* with the batch in mono on the right, then rows Perfumer · Source · Producer · Composed · Bottled. Rows without a value are hidden. Data comes from new `merowen.perfumer`, `source`, `producer`, `composed_in`, `bottled_in` and `batch` metafields (the setup script creates them); `lib/fallback.ts` has demo values with `[TBC]` placeholders. Owner to supply the perfumer's name, the producers and the bottling partner.

## Origin wording ("Made in the USA")
The FTC allows an unqualified "Made in USA" only when all or virtually all of the product is made in the US. Glass, caps and raw materials here are imported, so the site says **"Composed in Park City, Utah"** (hero eyebrow, About, provenance rows) and never "Made in the USA". If bottling is also done in the US, "Composed and bottled in the USA" is a qualified claim that's defensible; confirm with counsel before using it.

## New product: Peptide Cream (FC/10)
Added to `lib/fieldcare.ts` and the design. Step Skin, scent Kilda or Unscented, 50 ml, $120. Vessel: chamfered obsidian glass jar, blackened-steel knurled lid with the M seal. Image `merowen_care_peptide_v05.jpg`. Claims copy stays within the brand rules: "support", "firmer-looking", "reinforce the barrier". Do not write "repairs", "anti-ageing", "clinically proven" or any percentage without a test. Create the Shopify product with handle `peptide-cream` and variants Kilda / Unscented.

## Copy revisions (15 Oct)
- Posting taglines are now all personas: Mirbat *The night envoy.* · Azrou *The early riser.* · Torbeck *The quiet operator.* · Kilda *The cliff walker.*
- Mirbat and Kilda descriptions trimmed of stock phrases ("quietly magnetic", "warmer than it first appears").
- All ten Field Care descriptions rewritten in the Postings voice: short, concrete, one sensory line each. Source of truth: `lib/fieldcare.ts`.
- The wearers band uses the original cliff-walkers still (`merowen_brand_wearers_v01`), not a product-in-hand shot.

## Field Care imagery (v05)
All ten Field Care products and the ritual shot were regenerated on 15 Oct 2026 in the new vessel language (chamfered obsidian glass or matte black aluminium, knurled blackened-steel caps and pumps with the M seal, bone-ink lettering). Files: `merowen_care_{shavecream,balm,tonic,shampoo,conditioner,facewash,moisturiser,nightoil,deodorant,peptide,ritual}_v05.jpg`. Upload to Shopify Files with these exact names; `lib/fieldcare.ts` already points at them. The Field Care page no longer has a line-up hero image.

## Films (v05)
Source files in `design/films/`, 1080p, silent, generated 15 Oct 2026. Transcode before upload:
```bash
for f in design/films/*_v05.mp4; do ffmpeg -i "$f" -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart "${f%.mp4}_web.mp4"; done
```
The mobile 9:16 hero film is not yet regenerated for v05 (the first attempt drifted off the bottle); phones show `merowen_hero_mobile_v05.jpg` until it is. Posting films are 3:4; the 4:5 slot crops them with `object-fit: cover`.

## Assets
The images are already on the Shopify CDN (`lib/assets.ts`, `https://cdn.shopify.com/s/files/1/0860/2127/5868/files/`). Request widths with `shopifyImage(file, width)`: 2400 for the hero, 1400 for product images, 800 for cards. Add `loading="lazy"` and `decoding="async"` to everything except the hero, which gets `fetchPriority="high"`. `design/assets/*.jpg` are local copies for the prototype only.

## Files in this bundle
- `design/Merowen Storefront v4.dc.html` + `design/support.js` + `design/assets/`: the design reference.
- `deploy/wrangler.jsonc`, `deploy/.dev.vars.example`: copy to the repo root.
- `scripts/setup-shopify.mjs`: copy to `scripts/` in the repo.
- `CLAUDE_CODE_PROMPT.md`: paste into Claude Code from the repo root.
