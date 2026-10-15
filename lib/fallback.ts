import type { Product } from "./types";
import { assets, shopifyImage } from "./assets";

/** Library image for a product handle, used when Shopify has none yet. */
export function libraryImage(handle: string): string | null {
  const file = assets.postings[handle] ?? assets.range[handle];
  return file ? shopifyImage(file, 1400) : null;
}

/**
 * Built-in demo content, used until Shopify is connected (or if a Shopify call
 * fails) so the site always renders. Variant ids are null, so checkout stays
 * disabled on demo data.
 */
const demoVariants = [
  { id: null, title: "50 ml", price: "$195", available: false },
  { id: null, title: "100 ml", price: "$285", available: false },
];

const demoPostings: Product[] = [
  {
    id: "demo-mirbat",
    handle: "mirbat",
    title: "Mirbat",
    description:
      "Frankincense smoke over warm stone after dark. Resinous, composed and slow to leave.",
    variants: demoVariants,
    posting: {
      number: "01",
      coordinates: "17.0°N 54.7°E",
      perfumer: "[Perfumer name]",
      source: "Boswellia sacra resin, hand-tapped in the Dhofar hills, Oman. Distilled in Salalah.",
      producer: "[Co-operative / distiller TBC]",
      composedIn: "Park City, Utah",
      bottledIn: "[Bottling partner, city TBC]",
      batch: "Batch 01 · 2026",
      hour: "23:00",
      heroMaterial: "Omani frankincense · Dhofar, Oman",
      line: "The night envoy.",
      family: "Resinous Smoke",
      top: "Pink pepper, elemi",
      heart: "Omani frankincense, oud accord",
      base: "Labdanum, birch tar, ambergris accord",
      liquid: "#5E4636",
    },
  },
  {
    id: "demo-azrou",
    handle: "azrou",
    title: "Azrou",
    description:
      "Cold mountain air and sun-warmed cedar. Clean, upright and awake before everyone else.",
    variants: demoVariants,
    posting: {
      number: "02",
      coordinates: "33.4°N 5.2°W",
      perfumer: "[Perfumer name]",
      source: "Cedrus atlantica heartwood from managed forest in the Middle Atlas, Morocco. Steam-distilled near Azrou.",
      producer: "[Distiller TBC]",
      composedIn: "Park City, Utah",
      bottledIn: "[Bottling partner, city TBC]",
      batch: "Batch 01 · 2026",
      hour: "06:00",
      heroMaterial: "Atlas cedar · Middle Atlas, Morocco",
      line: "The early riser.",
      family: "Woody Aromatic",
      top: "Juniper berry, cypress",
      heart: "Atlas cedar, clary sage",
      base: "Oakmoss, ambrette, white musk",
      liquid: "#6F6553",
    },
  },
  {
    id: "demo-torbeck",
    handle: "torbeck",
    title: "Torbeck",
    description:
      "Rooted, green and precise. Haitian vetiver sharpened with bergamot and settled into cured tobacco.",
    variants: demoVariants,
    posting: {
      number: "03",
      coordinates: "18.2°N 73.8°W",
      perfumer: "[Perfumer name]",
      source: "Vetiveria zizanioides roots, 18-month harvest, Les Cayes plain, Sud, Haiti.",
      producer: "[Grower co-operative TBC]",
      composedIn: "Park City, Utah",
      bottledIn: "[Bottling partner, city TBC]",
      batch: "Batch 01 · 2026",
      hour: "17:00",
      heroMaterial: "Haitian vetiver · Sud, Haiti",
      line: "The quiet operator.",
      family: "Green Earth",
      top: "Bergamot, grapefruit peel",
      heart: "Haitian vetiver, black tea",
      base: "Tobacco leaf, sandalwood",
      liquid: "#46483F",
    },
  },
  {
    id: "demo-kilda",
    handle: "kilda",
    title: "Kilda",
    description:
      "Atlantic wind across sea cliffs and wild heather. Bracing and mineral, with heather warmth underneath.",
    variants: demoVariants,
    posting: {
      number: "04",
      coordinates: "57.8°N 8.6°W",
      perfumer: "[Perfumer name]",
      source: "Fucus vesiculosus seaweed absolute from the Atlantic coast of Scotland, plus wild heather.",
      producer: "[Supplier TBC]",
      composedIn: "Park City, Utah",
      bottledIn: "[Bottling partner, city TBC]",
      batch: "Batch 01 · 2026",
      hour: "20:00",
      heroMaterial: "Seaweed absolute · Atlantic Scotland",
      line: "The cliff walker.",
      family: "Mineral Marine",
      top: "Sea salt accord, seaweed absolute",
      heart: "Heather, juniper, iris",
      base: "Driftwood accord, ambrette, mineral musk",
      liquid: "#5A646A",
    },
  },
];

export const fallbackPostings: Product[] = demoPostings.map((p) => ({
  ...p,
  image: libraryImage(p.handle),
  imageAlt: `${p.title} flacon`,
}));

export type RangeItem = {
  handle: string;
  title: string;
  /** Discover · Wear · Carry · Keep */
  role: string;
  format: string;
  /** Planned price, shown on cards and in demo mode. Shopify variant prices win on product pages. */
  price: string;
  line: string;
  body: string;
  /** Not yet on sale: shown with an "In preparation" label and a Notify me button. */
  preparing?: boolean;
};

/** The wider range. Each card links to /products/<handle> in Shopify. */
export const rangeItems: RangeItem[] = [
  {
    handle: "the-dossier",
    title: "The Dossier",
    role: "Discover",
    format: "4 × 2 ml",
    price: "$38",
    line: "Four places. Two millilitres each.",
    body: "All four postings sealed in a linen envelope with a blackened-steel seal. Its price is credited toward your first flacon.",
  },
  {
    handle: "mirbat-extrait",
    title: "Mirbat Extrait",
    role: "Wear",
    format: "30 ml, numbered",
    price: "$340",
    line: "The night envoy, at closer range.",
    body: "Posting 01 at higher concentration, released in hand-numbered batches.",
    preparing: true,
  },
  {
    handle: "the-field-kit",
    title: "The Field Kit",
    role: "Carry",
    format: "45 mm steel compact",
    price: "$95",
    line: "A posting you can carry.",
    body: "Your posting as a solid balm in a knurled blackened-steel compact. Lives in a jacket pocket; the pan refills.",
    preparing: true,
  },
  {
    handle: "the-refill",
    title: "The Refill",
    role: "Keep",
    format: "200 ml flask",
    price: "$395",
    line: "Kept for life.",
    body: "A heavy refill flask, so your flacon is kept for life rather than thrown away.",
  },
];

export function getRangeItem(handle: string): RangeItem | null {
  return rangeItems.find((r) => r.handle === handle) ?? null;
}
