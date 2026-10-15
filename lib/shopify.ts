import "server-only";
import { fallbackPostings, libraryImage } from "./fallback";
import type { Cart, Film, HomeMedia, PostingMeta, Product, Variant } from "./types";

/* ------------------------------------------------------------------ */
/* Client                                                              */
/* ------------------------------------------------------------------ */

function config() {
  return {
    domain: process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    version: process.env.SHOPIFY_API_VERSION || "2026-07",
    postingsCollection: process.env.SHOPIFY_POSTINGS_COLLECTION || "postings",
  };
}

export function isShopifyConfigured(): boolean {
  const { domain, token } = config();
  return Boolean(domain && token && !domain.startsWith("your-store"));
}

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const { domain, token, version } = config();
  if (!isShopifyConfigured()) throw new Error("Shopify is not configured");

  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token as string,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = (await res.json()) as GraphQLResponse<T>;
  if (!res.ok || json.errors?.length || !json.data) {
    const detail = json.errors?.map((e) => e.message).join("; ") || res.statusText;
    throw new Error(`Shopify Storefront API error: ${detail}`);
  }
  return json.data;
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

type Money = { amount: string; currencyCode: string };

export function formatMoney(money: Money | null | undefined): string | null {
  if (!money) return null;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(money.amount));
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

const POSTING_KEYS = [
  "posting_number",
  "coordinates",
  "hour",
  "hero_material",
  "line",
  "family",
  "notes_top",
  "notes_heart",
  "notes_base",
  "liquid_color",
  "perfumer",
  "source",
  "producer",
  "composed_in",
  "bottled_in",
  "batch",
  "film",
  "film_poster",
] as const;

const VIDEO_FIELDS = /* GraphQL */ `
  ... on Video { sources { url mimeType width height } previewImage { url } }
  ... on MediaImage { image { url } }
  ... on GenericFile { url mimeType }
`;

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    featuredImage { url altText }
    variants(first: 10) {
      nodes { id title availableForSale price { amount currencyCode } }
    }
    metafields(identifiers: [${POSTING_KEYS.map((k) => `{namespace: "merowen", key: "${k}"}`).join(", ")}]) {
      key
      value
      reference { ${VIDEO_FIELDS} }
    }
  }
`;

type FileReference = {
  sources?: { url: string; mimeType: string; width?: number; height?: number }[];
  previewImage?: { url: string } | null;
  image?: { url: string } | null;
  url?: string;
  mimeType?: string;
} | null;

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  variants: {
    nodes: { id: string; title: string; availableForSale: boolean; price: Money }[];
  };
  metafields: ({ key: string; value: string; reference: FileReference } | null)[];
};

/** Prefer WebM then MP4, highest resolution first. Shopify transcodes uploads into several. */
function toFilm(ref: FileReference, posterOverride?: string | null): Film | null {
  if (!ref?.sources?.length) return null;
  const rank = (m: string) => (m.includes("webm") ? 0 : m.includes("mp4") ? 1 : 2);
  const sources = [...ref.sources]
    .filter((s) => !s.mimeType.includes("mpegurl")) // HLS needs a player; plain <video> uses files
    .sort((a, b) => rank(a.mimeType) - rank(b.mimeType) || (b.height ?? 0) - (a.height ?? 0));
  return { sources, poster: posterOverride ?? ref.previewImage?.url ?? null };
}

function mapProduct(raw: RawProduct): Product {
  const mf = new Map<string, { value: string; reference: FileReference }>();
  for (const m of raw.metafields) if (m) mf.set(m.key, { value: m.value, reference: m.reference });
  const v = (k: string) => mf.get(k)?.value ?? "";

  const variants: Variant[] = raw.variants.nodes.map((n) => ({
    id: n.id,
    title: n.title === "Default Title" ? "" : n.title,
    price: formatMoney(n.price),
    available: n.availableForSale,
  }));

  let posting: PostingMeta | null = null;
  if (v("coordinates")) {
    const posterRef = mf.get("film_poster")?.reference;
    posting = {
      number: v("posting_number"),
      coordinates: v("coordinates"),
      hour: v("hour"),
      heroMaterial: v("hero_material"),
      line: v("line"),
      family: v("family"),
      top: v("notes_top"),
      heart: v("notes_heart"),
      base: v("notes_base"),
      liquid: v("liquid_color") || "#5E4636",
      perfumer: v("perfumer") || null,
      source: v("source") || null,
      producer: v("producer") || null,
      composedIn: v("composed_in") || "Park City, Utah",
      bottledIn: v("bottled_in") || null,
      batch: v("batch") || null,
      film: toFilm(mf.get("film")?.reference ?? null, posterRef?.image?.url ?? null),
    };
  }

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    image: raw.featuredImage?.url ?? libraryImage(raw.handle),
    imageAlt: raw.featuredImage?.altText ?? null,
    variants,
    posting,
  };
}

/** The four Postings, from the Shopify collection, in posting-number order. */
export async function getPostings(): Promise<{ products: Product[]; live: boolean }> {
  if (!isShopifyConfigured()) return { products: fallbackPostings, live: false };
  try {
    const data = await shopifyFetch<{ collection: { products: { nodes: RawProduct[] } } | null }>(
      /* GraphQL */ `
        ${PRODUCT_FIELDS}
        query Postings($handle: String!) {
          collection(handle: $handle) {
            products(first: 12) { nodes { ...ProductFields } }
          }
        }
      `,
      { handle: config().postingsCollection },
    );
    const products = (data.collection?.products.nodes ?? [])
      .map(mapProduct)
      .filter((p) => p.posting)
      .sort((a, b) => (a.posting!.number || "").localeCompare(b.posting!.number || ""));
    if (!products.length) return { products: fallbackPostings, live: false };
    return { products, live: true };
  } catch (err) {
    console.error(err);
    return { products: fallbackPostings, live: false };
  }
}

export async function getProduct(handle: string): Promise<Product | null> {
  const demo = fallbackPostings.find((p) => p.handle === handle) ?? null;
  if (!isShopifyConfigured()) return demo;
  try {
    const data = await shopifyFetch<{ product: RawProduct | null }>(
      /* GraphQL */ `
        ${PRODUCT_FIELDS}
        query Product($handle: String!) { product(handle: $handle) { ...ProductFields } }
      `,
      { handle },
    );
    return data.product ? mapProduct(data.product) : null;
  } catch (err) {
    console.error(err);
    return demo;
  }
}

/* ------------------------------------------------------------------ */
/* Home page media (metaobject `home_page`, handle `home`)              */
/* ------------------------------------------------------------------ */

export async function getHomeMedia(): Promise<HomeMedia> {
  if (!isShopifyConfigured()) return {};
  try {
    const field = (alias: string, key: string) =>
      `${alias}: field(key: "${key}") { value reference { ${VIDEO_FIELDS} } }`;
    const data = await shopifyFetch<{
      metaobject: Record<string, { value: string | null; reference: FileReference } | null> | null;
    }>(/* GraphQL */ `
      query HomeMedia {
        metaobject(handle: { type: "home_page", handle: "home" }) {
          ${field("desktop", "hero_film_desktop")}
          ${field("mobile", "hero_film_mobile")}
          ${field("poster", "hero_poster")}
          ${field("audio", "hero_audio")}
          ${field("caption", "hero_caption")}
        }
      }
    `);
    const m = data.metaobject;
    if (!m) return {};
    const poster = m.poster?.reference?.image?.url ?? null;
    return {
      desktop: toFilm(m.desktop?.reference ?? null, poster),
      mobile: toFilm(m.mobile?.reference ?? null, poster),
      poster,
      audio: m.audio?.reference?.url ?? null,
      caption: m.caption?.value ?? null,
    };
  } catch (err) {
    console.error(err);
    return {};
  }
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
    discountCodes { code applicable }
    discountAllocations { discountedAmount { amount currencyCode } }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            title
            image { url }
            product { title handle featuredImage { url } }
          }
        }
      }
    }
  }
`;

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  discountCodes: { code: string; applicable: boolean }[];
  discountAllocations: { discountedAmount: Money }[];
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Money };
      merchandise: {
        title: string;
        image: { url: string } | null;
        product: { title: string; handle: string; featuredImage: { url: string } | null };
      };
    }[];
  };
};

function mapCart(raw: RawCart): Cart {
  const sub = raw.cost.subtotalAmount;
  const off = raw.discountAllocations.reduce((sum, d) => sum + Number(d.discountedAmount.amount), 0);
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: formatMoney(sub) ?? "",
    total: formatMoney({ amount: String(Math.max(0, Number(sub.amount) - off)), currencyCode: sub.currencyCode }) ?? "",
    credit: off > 0 ? formatMoney({ amount: String(off), currencyCode: sub.currencyCode }) : null,
    discountCodes: raw.discountCodes ?? [],
    lines: raw.lines.nodes.map((l) => ({
      id: l.id,
      quantity: l.quantity,
      title: l.merchandise.product.title,
      variantTitle: l.merchandise.title === "Default Title" ? "" : l.merchandise.title,
      handle: l.merchandise.product.handle,
      image: l.merchandise.image?.url ?? l.merchandise.product.featuredImage?.url ?? null,
      total: formatMoney(l.cost.totalAmount) ?? "",
    })),
  };
}

type UserError = { message: string };

function assertNoUserErrors(errors: UserError[] | undefined) {
  if (errors?.length) throw new Error(errors.map((e) => e.message).join("; "));
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const data = await shopifyFetch<{ cart: RawCart | null }>(
      `${CART_FIELDS} query Cart($id: ID!) { cart(id: $id) { ...CartFields } }`,
      { id: cartId },
    );
    return data.cart ? mapCart(data.cart) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: RawCart; userErrors: UserError[] } }>(
    `${CART_FIELDS} mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { message } }
    }`,
    { lines },
  );
  assertNoUserErrors(data.cartCreate.userErrors);
  return mapCart(data.cartCreate.cart);
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: RawCart; userErrors: UserError[] } }>(
    `${CART_FIELDS} mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } }
    }`,
    { cartId, lines },
  );
  assertNoUserErrors(data.cartLinesAdd.userErrors);
  return mapCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: RawCart; userErrors: UserError[] } }>(
    `${CART_FIELDS} mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  assertNoUserErrors(data.cartLinesUpdate.userErrors);
  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: RawCart; userErrors: UserError[] } }>(
    `${CART_FIELDS} mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { message } }
    }`,
    { cartId, lineIds: [lineId] },
  );
  assertNoUserErrors(data.cartLinesRemove.userErrors);
  return mapCart(data.cartLinesRemove.cart);
}

/** Replaces the cart's discount codes (the Dossier credit). Pass [] to remove. */
export async function updateDiscountCodes(cartId: string, discountCodes: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartDiscountCodesUpdate: { cart: RawCart; userErrors: UserError[] } }>(
    `${CART_FIELDS} mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) { cart { ...CartFields } userErrors { message } }
    }`,
    { cartId, discountCodes },
  );
  assertNoUserErrors(data.cartDiscountCodesUpdate.userErrors);
  return mapCart(data.cartDiscountCodesUpdate.cart);
}
