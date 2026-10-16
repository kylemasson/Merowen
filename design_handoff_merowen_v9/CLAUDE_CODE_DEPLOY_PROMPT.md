Read `START_HERE.md`, `DEPLOY.md` and `design_handoff_merowen_v9/README.md` first. Then do the following, in order, committing after each step on the `v4-redesign` branch and running `npm run check` before every commit. Stop and ask me if anything under "Open decisions" in the README comes up.

## 1. Repo
- Rename `CLAUDE.updated.md` to `CLAUDE.md`, replacing the old one.
- Make sure `wrangler.jsonc`, `.dev.vars.example` and `scripts/setup-shopify.mjs` are at the repo root / in `scripts/`.
- Push the branch to `kylemasson/Merowen`. If the push fails, show me the exact error.

## 2. Shopify media (upload via Admin API or tell me the exact files to drag into Content → Files)
Upload every file in `design_handoff_merowen_v9/design/assets/` whose name ends in `_v05.jpg` or `_v01.jpg`, keeping the filenames, plus the transcoded films from `design/films/` (transcode commands are in the README under "Films"). The new per-posting box shots are `merowen_box_{blackfriars,guardsman,mayfair,empire}_v08.jpg`.
Then run `scripts/setup-shopify.mjs` with the Admin token and confirm the `merowen.*` metafields and the `home_page` metaobject exist. Set each posting's `merowen.film` to its film, `merowen.liquid_color` to the hex in `lib/fallback.ts`, and add the box shot as the product's second image.

## 3. Code: product gallery
In `components/PostingDetail.tsx`, when the product has no Shopify gallery, build one from `assets.postings[handle]`, then `assets.boxes[handle]` from `lib/assets.ts`. Never show another posting's box. The About page keeps `assets.box`.

## 4. Code: the rest of the v4 spec
Step 2 (Graphite tokens) and the scroll-reveal animations are already applied. Continue from step 3 of `design_handoff_merowen_v9/CLAUDE_CODE_PROMPT.md`: header, bag drawer, Dossier code, product layout and mobile buy bar, home sections, Field Care page, new routes, image sizing and the accessibility checklist.

## 5. Cloudflare
- `npx wrangler login`, then `npx wrangler secret put SHOPIFY_STOREFRONT_ACCESS_TOKEN` (I will paste the Headless token).
- Confirm the Worker name in `wrangler.jsonc` matches the dashboard (`merowen-storefront`).
- Run `npm run preview` locally and check `/`, `/products/guardsman` and `/field-care` render with the Graphite palette and the correct box image.
- Tell me when the branch preview build is green so I can merge to `main`, which deploys through Workers Builds.

When finished, list every `[...]` placeholder still in the copy and anything you could not complete.
