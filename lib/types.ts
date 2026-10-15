export type VideoSource = {
  url: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
};

/** A film uploaded to Shopify (or any URL) plus its still poster frame. */
export type Film = {
  sources: VideoSource[];
  poster?: string | null;
};

export type Variant = {
  /** Shopify ProductVariant GID. Null when running on built-in demo data. */
  id: string | null;
  title: string;
  price: string | null;
  available: boolean;
};

/** The Merowen-specific details stored in `merowen.*` product metafields. */
export type PostingMeta = {
  number: string;
  coordinates: string;
  hour: string;
  heroMaterial: string;
  line: string;
  family: string;
  top: string;
  heart: string;
  base: string;
  liquid: string;
  film?: Film | null;
  /** Provenance, shown under the notes. All optional; rows with no value are hidden. */
  perfumer?: string | null;
  source?: string | null;
  producer?: string | null;
  composedIn?: string | null;
  bottledIn?: string | null;
  batch?: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: string | null;
  imageAlt?: string | null;
  variants: Variant[];
  /** Present only for products set up as Postings. */
  posting?: PostingMeta | null;
};

export type HomeMedia = {
  desktop?: Film | null;
  mobile?: Film | null;
  poster?: string | null;
  audio?: string | null;
  caption?: string | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string;
  handle: string;
  image?: string | null;
  total: string;
};

export type DiscountCode = { code: string; applicable: boolean };

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  /** Before cart-level discounts. */
  subtotal: string;
  /** After cart-level discounts (the Dossier credit), before shipping and tax. */
  total: string;
  /** Cart-level discount taken off, formatted; null when nothing applies. */
  credit: string | null;
  discountCodes: DiscountCode[];
  lines: CartLine[];
};
