You're working in the `kylemasson/Merowen` repo (Next.js 16.3.8, OpenNext Cloudflare, Shopify Storefront API). Read `design_handoff_merowen_storefront/README.md` in full before you start. Then open `design/Merowen Storefront v4.dc.html` in a browser and use it as the visual reference.

Rules:
- Upgrade the existing code; do not rewrite it. Keep `lib/shopify.ts`, `app/actions.ts`, the cart cookie and the server actions. Extend them.
- Styling stays in `app/globals.css` (tokens + classes). Don't copy inline styles from the prototype.
- Don't upgrade Next.js or OpenNext. They're pinned together.
- When you hit any item under "Open decisions", stop and ask me.

Do the work in this order. Commit after each step, and run `npm run typecheck` before each commit:
1. Copy `deploy/wrangler.jsonc`, `deploy/.dev.vars.example` and `scripts/setup-shopify.mjs` into the repo, then confirm `npm run preview` builds.
2. Migrate the Graphite tokens in `globals.css`. Update `Seal.tsx`, `themeColor` and the liquid colours. Add the `:focus-visible` rule.
3. Header: the seal · MEROWEN lockup and the new nav.
4. Bag drawer, including focus trap, Esc, scroll lock and focus return. Keep `/cart` as the no-JS fallback. Apply the same behaviour to the mobile menu.
5. Dossier code: Storefront `cartDiscountCodesUpdate`, the server actions, and the UI states.
6. Product page: two-column layout from 760px up, posting film slot, details copy, and the sticky mobile buy bar.
7. Home: section order, Find your hour, Range cards, Field Care grid (no line-up photo), Inner Circle copy, and the hero Pause control.
8. Field Care page changes. New routes `/range`, `/about`, `/refill-programme`.
9. Image sizing and lazy loading. Then a pass over the accessibility checklist.

When you're done, list every placeholder `[...]` still in the copy.
