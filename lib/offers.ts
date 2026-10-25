import "server-only";

import { POSTINGS, SIZES, careItem, hh, isPreparing, posting, rangeItem } from "./catalog";
import { getShopifyProduct, shopifyConfigured } from "./shopify";

// What can be bought for a product handle: its options, each with a variant ID and price.
// Demo variant IDs look like "demo:<handle>:<index>" and only work with the demo bag.

export type OfferOption = {
  label: string;
  sub?: string;
  variantId: string | null;
  price: number;
  currency: string;
  available: boolean;
};

export type Offer = {
  handle: string;
  optionLabel: string | null;
  options: OfferOption[];
  film: string | null;
  live: boolean;
};

type DemoOption = { label: string; sub?: string; price: number };

export function demoOptions(handle: string): { optionLabel: string | null; options: DemoOption[] } | null {
  const p = posting(handle);
  if (p) return { optionLabel: "Size", options: SIZES.map((s) => ({ label: s.label, price: s.price })) };
  const r = rangeItem(handle);
  if (r?.byPosting)
    return {
      optionLabel: "Posting",
      options: POSTINGS.map((x) => ({ label: x.name, sub: `${x.num} · ${hh(x.hour)}`, price: r.price })),
    };
  if (r) return { optionLabel: null, options: [{ label: r.format, price: r.price }] };
  const c = careItem(handle);
  if (c?.formats) return { optionLabel: "Format", options: c.formats.map((f) => ({ label: f.label, price: f.price })) };
  if (c) return { optionLabel: null, options: [{ label: c.size, price: c.price }] };
  return null;
}

export { isPreparing };

export async function getOffer(handle: string): Promise<Offer | null> {
  const demo = demoOptions(handle);
  if (!demo) return null;
  const preparing = isPreparing(handle);

  if (shopifyConfigured()) {
    const product = await getShopifyProduct(handle).catch((err) => {
      console.error(`Shopify product ${handle}:`, err);
      return null;
    });
    const variants = product?.variants.nodes ?? [];
    if (variants.length) {
      const sources = product?.film?.reference?.sources ?? [];
      const film = sources.find((s) => s.mimeType === "video/mp4")?.url ?? sources[0]?.url ?? null;
      return {
        handle,
        optionLabel: variants.length > 1 ? demo.optionLabel : null,
        options: variants.map((v, i) => ({
          label: v.title === "Default Title" ? (demo.options[i]?.label ?? "") : v.title,
          sub: demo.options[i]?.sub,
          variantId: v.id,
          price: Number(v.price.amount),
          currency: v.price.currencyCode,
          available: v.availableForSale && !preparing,
        })),
        film,
        live: true,
      };
    }
    // Not in Shopify yet: show the catalogue prices but don't let it into a real cart.
    return {
      handle,
      optionLabel: demo.optionLabel,
      options: demo.options.map((o) => ({ ...o, variantId: null, currency: "USD", available: false })),
      film: null,
      live: true,
    };
  }

  return {
    handle,
    optionLabel: demo.optionLabel,
    options: demo.options.map((o, i) => ({
      ...o,
      variantId: `demo:${handle}:${i}`,
      currency: "USD",
      available: !preparing,
    })),
    film: null,
    live: false,
  };
}
