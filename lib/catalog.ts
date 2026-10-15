// The Merowen catalogue as written in the v4 design handoff. It supplies all copy and imagery.
// Shopify, when a token is set, supplies live prices, variant IDs and films (see lib/shopify.ts).

export type PostingHandle = "mirbat" | "azrou" | "torbeck" | "kilda";

export type Posting = {
  handle: PostingHandle;
  num: string;
  name: string;
  hour: number;
  coords: string;
  line: string;
  desc: string;
  material: string;
  family: string;
  top: string;
  heart: string;
  base: string;
  liquid: string;
  source: string;
  producer: string;
  image: string;
  extras: string[];
};

export type RangeItem = {
  handle: string;
  name: string;
  role: string;
  format: string;
  price: number;
  image: string;
  line: string;
  desc: string;
  preparing?: boolean;
  byPosting?: boolean;
};

export type CareStep = "Shave" | "Hair" | "Skin" | "Body";

export type CareItem = {
  handle: string;
  code: string;
  name: string;
  step: CareStep;
  scent: PostingHandle;
  size: string;
  keys: string;
  vessel: string;
  line: string;
  note: string;
  price: number;
  image: string;
  formats?: { label: string; price: number }[];
};

export const media = (file: string) => `/media/${file}`;

export const SIZES = [
  { label: "50 ml", price: 195 },
  { label: "100 ml", price: 285 },
];

export const POSTINGS: Posting[] = [
  {
    handle: "mirbat",
    num: "01",
    name: "Mirbat",
    hour: 23,
    coords: "17.0°N 54.7°E",
    line: "The night envoy.",
    desc: "Frankincense smoke over warm stone after dark. Resinous, composed and slow to leave.",
    material: "Omani frankincense · Dhofar, Oman",
    family: "Resinous Smoke",
    top: "Pink pepper, elemi",
    heart: "Omani frankincense, oud accord",
    base: "Labdanum, birch tar, ambergris accord",
    liquid: "#5E4636",
    source: "Boswellia sacra resin, hand-tapped in the Dhofar hills, Oman. Distilled in Salalah.",
    producer: "[Co-operative / distiller TBC]",
    image: media("merowen_master_mirbat_v05.jpg"),
    extras: [],
  },
  {
    handle: "azrou",
    num: "02",
    name: "Azrou",
    hour: 6,
    coords: "33.4°N 5.2°W",
    line: "The early riser.",
    desc: "Cold mountain air and sun-warmed cedar. Crisp, upright and awake before everyone else.",
    material: "Atlas cedar · Middle Atlas, Morocco",
    family: "Woody Aromatic",
    top: "Juniper berry, cypress",
    heart: "Atlas cedar, clary sage",
    base: "Oakmoss, ambrette, white musk",
    liquid: "#6F6553",
    source: "Cedrus atlantica heartwood from managed forest in the Middle Atlas, Morocco. Steam-distilled near Azrou.",
    producer: "[Distiller TBC]",
    image: media("merowen_master_azrou_v05.jpg"),
    extras: [],
  },
  {
    handle: "torbeck",
    num: "03",
    name: "Torbeck",
    hour: 17,
    coords: "18.2°N 73.8°W",
    line: "The quiet operator.",
    desc: "Rooted, green and precise. Haitian vetiver sharpened with bergamot and settled into cured tobacco.",
    material: "Haitian vetiver · Sud, Haiti",
    family: "Green Earth",
    top: "Bergamot, grapefruit peel",
    heart: "Haitian vetiver, black tea",
    base: "Tobacco leaf, sandalwood",
    liquid: "#46483F",
    source: "Vetiveria zizanioides roots, 18-month harvest, Les Cayes plain, Sud, Haiti.",
    producer: "[Grower co-operative TBC]",
    image: media("merowen_master_torbeck_v05.jpg"),
    extras: [],
  },
  {
    handle: "kilda",
    num: "04",
    name: "Kilda",
    hour: 20,
    coords: "57.8°N 8.6°W",
    line: "The cliff walker.",
    desc: "Atlantic wind across sea cliffs and wild heather. Bracing and mineral, with heather warmth underneath.",
    material: "Seaweed absolute · Atlantic Scotland",
    family: "Mineral Marine",
    top: "Sea salt accord, seaweed absolute",
    heart: "Heather, juniper, iris",
    base: "Driftwood accord, ambrette, mineral musk",
    liquid: "#5A646A",
    source: "Fucus vesiculosus seaweed absolute from the Atlantic coast of Scotland, plus wild heather.",
    producer: "[Supplier TBC]",
    image: media("merowen_master_kilda_v05.jpg"),
    extras: [],
  },
];

export const RANGE: RangeItem[] = [
  {
    handle: "the-dossier",
    name: "The Dossier",
    role: "Discover",
    format: "4 × 2 ml",
    price: 38,
    image: media("merowen_range_dossier_v05.jpg"),
    line: "Four places. Two millilitres each.",
    desc: "All four postings sealed in a linen envelope with a blackened-steel seal. Its price is credited toward your first flacon.",
  },
  {
    handle: "mirbat-extrait",
    name: "Mirbat Extrait",
    role: "Wear",
    format: "30 ml, numbered",
    price: 340,
    image: media("merowen_range_extrait_v05.jpg"),
    line: "The night envoy, at closer range.",
    desc: "Posting 01 at higher concentration, released in hand-numbered batches.",
    preparing: true,
  },
  {
    handle: "the-field-kit",
    name: "The Field Kit",
    role: "Carry",
    format: "45 mm steel compact",
    price: 95,
    image: media("merowen_range_fieldkit_v05.jpg"),
    line: "A posting you can carry.",
    desc: "Your posting as a solid balm in a knurled blackened-steel compact. Lives in a jacket pocket; the pan refills.",
    preparing: true,
  },
  {
    handle: "the-refill",
    name: "The Refill",
    role: "Keep",
    format: "200 ml flask",
    price: 395,
    image: media("merowen_range_refill_v05.jpg"),
    line: "Kept for life.",
    desc: "A heavy refill flask, so your flacon is kept for life rather than thrown away.",
    byPosting: true,
  },
];

const care = (file: string) => media(`merowen_care_${file}_v05.jpg`);

export const CARE: CareItem[] = [
  {
    handle: "shave-cream",
    code: "FC/01",
    name: "Shave Cream",
    step: "Shave",
    scent: "azrou",
    size: "150 ml",
    keys: "Shea butter, glycerin, aloe vera, Atlas cedarwood oil",
    vessel: "Matte black aluminium tube, blackened-steel cap",
    line: "A close shave before first light.",
    note: "Lathers thick from a little, lifts the hair and holds water on the skin, so the blade does less work. Atlas cedar in the steam.",
    price: 48,
    image: care("shavecream"),
  },
  {
    handle: "aftershave-balm",
    code: "FC/02",
    name: "Aftershave Balm",
    step: "Shave",
    scent: "mirbat",
    size: "75 ml",
    keys: "Frankincense oil, squalane, oat extract, panthenol",
    vessel: "Obsidian glass bottle, blackened-steel pump",
    line: "Calm after the blade.",
    note: "Takes the heat out of a shave and leaves no film. Frankincense, squalane and oat, in a balm that disappears in a minute.",
    price: 62,
    image: care("balm"),
  },
  {
    handle: "aftershave-tonic",
    code: "FC/03",
    name: "Aftershave Tonic",
    step: "Shave",
    scent: "kilda",
    size: "100 ml",
    keys: "Witch hazel, sea fennel extract, allantoin, heather extract",
    vessel: "Heavy clear glass flacon, blackened-steel screw cap",
    line: "Cold water off the Atlantic.",
    note: "Cold on the skin, then gone. Witch hazel and sea fennel settle the sting; heather and salt stay faintly behind.",
    price: 58,
    image: care("tonic"),
  },
  {
    handle: "shampoo",
    code: "FC/04",
    name: "Shampoo",
    step: "Hair",
    scent: "kilda",
    size: "250 ml",
    keys: "Kelp extract, coconut-derived cleansers, panthenol, rosemary oil",
    vessel: "Obsidian glass bottle, blackened-steel pump",
    line: "Salt air, without the salt.",
    note: "Washes without stripping. Kelp and rosemary leave hair with weight and the smell of the shore.",
    price: 44,
    image: care("shampoo"),
  },
  {
    handle: "conditioner",
    code: "FC/05",
    name: "Conditioner",
    step: "Hair",
    scent: "kilda",
    size: "250 ml",
    keys: "Kelp extract, hydrolysed oat protein, shea butter, argan oil",
    vessel: "Obsidian glass bottle, blackened-steel pump",
    line: "Weight where it belongs.",
    note: "Oat protein and argan put back what the wind takes out. Hair that moves and doesn't need help in the morning.",
    price: 44,
    image: care("conditioner"),
  },
  {
    handle: "basalt-face-wash",
    code: "FC/06",
    name: "Basalt Face Wash",
    step: "Skin",
    scent: "azrou",
    size: "100 ml",
    keys: "Volcanic clay, activated charcoal, glycerin, cedarwood oil",
    vessel: "Matte black aluminium tube, blackened-steel cap",
    line: "Cool as wet stone.",
    note: "Volcanic clay and charcoal lift the day off your face. Rinses away with no squeak and a trace of cedar.",
    price: 42,
    image: care("facewash"),
  },
  {
    handle: "daily-moisturiser",
    code: "FC/07",
    name: "Daily Moisturiser",
    step: "Skin",
    scent: "torbeck",
    size: "50 ml",
    keys: "Niacinamide, hyaluronic acid, squalane, vetiver oil",
    vessel: "Obsidian glass jar, blackened-steel lid",
    line: "Rooted, all day.",
    note: "Niacinamide and hyaluronic acid under squalane. Dry in seconds, matte by the time you've found your coat. Vetiver, faint.",
    price: 68,
    image: care("moisturiser"),
  },
  {
    handle: "night-oil",
    code: "FC/08",
    name: "Night Oil",
    step: "Skin",
    scent: "mirbat",
    size: "30 ml",
    keys: "Frankincense oil, squalane, rosehip oil, vitamin E",
    vessel: "Obsidian glass dropper, blackened-steel collar",
    line: "Works while the city sleeps.",
    note: "Four drops, pressed in. Frankincense, rosehip and squalane work while you sleep and are gone by the alarm.",
    price: 85,
    image: care("nightoil"),
  },
  {
    handle: "deodorant",
    code: "FC/09",
    name: "Deodorant",
    step: "Body",
    scent: "torbeck",
    size: "75 g, refillable",
    keys: "Magnesium hydroxide, arrowroot powder, shea butter, vetiver oil",
    vessel: "Refillable blackened-steel twist case, paper-based refill tubes",
    line: "Nothing to report.",
    note: "Magnesium and arrowroot take care of odour; vetiver keeps you quiet. Aluminium-free, in a steel case you'll never throw away.",
    price: 58,
    image: care("deodorant"),
    formats: [
      { label: "Case", price: 58 },
      { label: "Refill", price: 22 },
    ],
  },
  {
    handle: "peptide-cream",
    code: "FC/10",
    name: "Peptide Cream",
    step: "Skin",
    scent: "kilda",
    size: "50 ml",
    keys: "Signal peptides, copper tripeptide, hydrolysed silk protein, ceramides, squalane",
    vessel: "Chamfered obsidian glass jar, blackened-steel lid",
    line: "Morning and night. Firm ground.",
    note: "Morning and night, a pea's worth. Signal peptides and copper tripeptide support firmer-looking skin; silk protein and ceramides reinforce the barrier.",
    price: 120,
    image: care("peptide"),
  },
];

export const CARE_STEPS: CareStep[] = ["Shave", "Hair", "Skin", "Body"];

export const DOSSIER = RANGE[0];
export const REFILL = RANGE[3];

export const POSTINGS_BY_HOUR = [...POSTINGS].sort((a, b) => a.hour - b.hour);

export const posting = (handle: string) => POSTINGS.find((p) => p.handle === handle);
export const rangeItem = (handle: string) => RANGE.find((r) => r.handle === handle);
export const careItem = (handle: string) => CARE.find((c) => c.handle === handle);

/** The latest posting whose hour is at or before `hour`, wrapping round to the last one. */
export function postingForHour(hour: number): Posting {
  const h = ((hour % 24) + 24) % 24;
  return POSTINGS_BY_HOUR.filter((p) => p.hour <= h).pop() ?? POSTINGS_BY_HOUR[POSTINGS_BY_HOUR.length - 1];
}

export const hh = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

export const money = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);

export const FLACON_COPY =
  "Heavy-base glass in extra-clear flint with chamfered edges, the lower third in opaque matte black. Solid blackened-steel cap in satin gunmetal, knurled like a dive-watch crown, over a slim steel neck collar engraved with posting, hour, batch and date. No paper label: the name is printed on the glass in bone ink and the coordinates are etched into the base.";

export const BOX_COPY =
  "Uncoated black FSC board, blind-debossed seal, coordinate line printed in bone ink, magnetic close. No foil, no plastic insert.";

export const SHIPPING_COPY = "[Shipping and returns policy, pulled from Shopify]";

export const knownHandlesForSitemap = () => [...POSTINGS, ...RANGE, ...CARE].map((x) => x.handle);
