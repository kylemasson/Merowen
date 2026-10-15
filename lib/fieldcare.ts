/**
 * FIELD CARE — the Merowen grooming line.
 * Every product carries one of the four posting scents, so the line layers
 * with the fragrances. Packaging: obsidian-tinted recyclable glass or matte
 * black aluminium, blackened-steel caps and pumps, no paper labels: bone-white ink printed
 * straight onto glass or aluminium (steel is engraved).
 * Formulas below are the creative brief for the lab, not final INCI lists.
 */
export type CareStep = "Shave" | "Hair" | "Skin" | "Body";

export type CareProduct = {
  handle: string;
  code: string; // equipment-style number shown in Plex Mono
  title: string;
  step: CareStep;
  scent: "Mirbat" | "Azrou" | "Torbeck" | "Kilda";
  size: string;
  line: string; // one-line voice
  description: string;
  keyIngredients: string[];
  use: string;
  packaging: string;
  freeFrom: string[];
  /** Variant labels shown before Shopify is connected (Shopify variants win when present). */
  options?: string[];
  image: string; // file in public/media (or Shopify Files)
  /** Planned price for cards and demo mode. Shopify variant prices win on product pages. */
  price: string;
};

export const careLine: CareProduct[] = [
  {
    handle: "shave-cream",
    code: "FC/01",
    title: "Shave Cream",
    step: "Shave",
    scent: "Azrou",
    size: "150 ml",
    line: "A close shave before first light.",
    description:
      "Lathers thick from a little, lifts the hair and holds water on the skin, so the blade does less work. Atlas cedar in the steam.",
    keyIngredients: ["Glycerin", "Sodium hyaluronate", "Allantoin", "Shea butter", "Atlas cedarwood oil"],
    use: "Wet the face with hot water. Work an almond-sized amount into a lather and shave with the grain.",
    packaging: "Matte black aluminium tube, blackened-steel cap",
    freeFrom: ["Sulphates", "Mineral oil", "Microplastics"],
    image: "merowen_care_shavecream_v05.jpg",
    price: "$48",
  },
  {
    handle: "aftershave-balm",
    code: "FC/02",
    title: "Aftershave Balm",
    step: "Shave",
    scent: "Mirbat",
    size: "75 ml",
    line: "Calm after the blade.",
    description:
      "Takes the heat out of a shave and leaves no film. Frankincense, squalane and oat, in a balm that disappears in a minute.",
    keyIngredients: ["Niacinamide", "Panthenol", "Bisabolol", "Squalane", "Frankincense oil"],
    use: "Press two pumps into the face and neck after shaving.",
    packaging: "Obsidian glass bottle, blackened-steel pump",
    freeFrom: ["Drying alcohol", "Mineral oil", "Silicones"],
    options: ["Mirbat", "Unscented"],
    image: "merowen_care_balm_v05.jpg",
    price: "$62",
  },
  {
    handle: "aftershave-tonic",
    code: "FC/03",
    title: "Aftershave Tonic",
    step: "Shave",
    scent: "Kilda",
    size: "100 ml",
    line: "Cold water off the Atlantic.",
    description:
      "Cold on the skin, then gone. Witch hazel and sea fennel close the pores and settle the sting; heather and salt stay faintly behind.",
    keyIngredients: ["Witch hazel distillate", "Zinc PCA", "Salicylic acid", "Sea fennel extract", "Panthenol"],
    use: "Splash into cupped hands and pat onto the skin after shaving or a long day.",
    packaging: "Chamfered obsidian glass flacon, knurled blackened-steel cap",
    freeFrom: ["Drying alcohol", "Mineral oil"],
    image: "merowen_care_tonic_v05.jpg",
    price: "$58",
  },
  {
    handle: "shampoo",
    code: "FC/04",
    title: "Shampoo",
    step: "Hair",
    scent: "Kilda",
    size: "250 ml",
    line: "Salt air, without the salt.",
    description:
      "Cleans without stripping. Kelp and rosemary leave hair with weight and the smell of the shore.",
    keyIngredients: ["Sodium cocoyl isethionate", "Kelp extract", "Panthenol", "Guar conditioner", "Rosemary oil"],
    use: "Massage into wet hair and scalp, then rinse. Follow with Conditioner.",
    packaging: "Matte black aluminium bottle, blackened-steel pump",
    freeFrom: ["Sulphates (SLS/SLES)", "Silicones", "Mineral oil"],
    image: "merowen_care_shampoo_v05.jpg",
    price: "$44",
  },
  {
    handle: "conditioner",
    code: "FC/05",
    title: "Conditioner",
    step: "Hair",
    scent: "Kilda",
    size: "250 ml",
    line: "Weight where it belongs.",
    description:
      "Oat protein and argan put back what the wind takes out. Hair that moves and doesn't need help in the morning.",
    keyIngredients: ["Behentrimonium methosulfate", "Cetearyl alcohol", "Hydrolysed oat protein", "Argan oil", "Kelp extract"],
    use: "After shampoo, work through the lengths, leave for one minute and rinse.",
    packaging: "Matte black aluminium bottle, blackened-steel pump",
    freeFrom: ["Silicones", "Sulphates", "Mineral oil"],
    image: "merowen_care_conditioner_v05.jpg",
    price: "$44",
  },
  {
    handle: "face-wash",
    code: "FC/06",
    title: "Basalt Face Wash",
    step: "Skin",
    scent: "Azrou",
    size: "100 ml",
    line: "Clean as wet stone.",
    description:
      "Volcanic clay and charcoal pull the day off your face. Rinses clean, no squeak, a trace of cedar.",
    keyIngredients: ["Volcanic clay", "Sodium cocoyl glycinate", "Activated charcoal", "Glycerin", "Cedarwood oil"],
    use: "Massage onto damp skin morning and night, then rinse.",
    packaging: "Matte black aluminium tube, blackened-steel cap",
    freeFrom: ["Sulphates", "Microplastics", "Mineral oil"],
    image: "merowen_care_facewash_v05.jpg",
    price: "$42",
  },
  {
    handle: "moisturiser",
    code: "FC/07",
    title: "Daily Moisturiser",
    step: "Skin",
    scent: "Torbeck",
    size: "50 ml",
    line: "Rooted, all day.",
    description:
      "Niacinamide and hyaluronic acid under squalane. Dry in seconds, matte by the time you've found your coat. Vetiver, faint.",
    keyIngredients: ["Niacinamide", "Ceramide NP", "Sodium hyaluronate", "Squalane", "Vetiver oil"],
    use: "Apply a small amount to clean skin each morning.",
    packaging: "Obsidian glass jar, blackened-steel lid",
    freeFrom: ["Silicones", "Mineral oil", "Drying alcohol"],
    options: ["Torbeck", "Unscented"],
    image: "merowen_care_moisturiser_v05.jpg",
    price: "$68",
  },
  {
    handle: "night-oil",
    code: "FC/08",
    title: "Night Oil",
    step: "Skin",
    scent: "Mirbat",
    size: "30 ml",
    line: "Works while the city sleeps.",
    description:
      "Four drops, pressed in. Frankincense, rosehip and squalane work while you sleep and are gone by the alarm.",
    keyIngredients: ["Bakuchiol", "Squalane", "Rosehip oil", "Vitamin E", "Frankincense oil"],
    use: "Warm three drops between the palms and press into the face before bed.",
    packaging: "Obsidian glass dropper, blackened-steel collar",
    freeFrom: ["Mineral oil", "Silicones", "Retinol"],
    image: "merowen_care_nightoil_v05.jpg",
    price: "$85",
  },
  {
    handle: "deodorant",
    code: "FC/09",
    title: "Deodorant",
    step: "Body",
    scent: "Torbeck",
    size: "75 g · refillable",
    line: "Nothing to report.",
    description:
      "Magnesium and arrowroot keep you dry; vetiver keeps you quiet. Aluminium-free, in a steel case you'll never throw away.",
    keyIngredients: ["Magnesium hydroxide", "Zinc ricinoleate", "Arrowroot powder", "Jojoba oil", "Bisabolol"],
    use: "Apply to clean, dry underarms. Twist out a refill when the stick runs low; keep the case.",
    packaging: "Refillable blackened-steel twist case, paper-based refill tubes",
    freeFrom: ["Aluminium", "Baking soda", "Alcohol", "Mineral oil"],
    options: ["Torbeck", "Unscented"],
    image: "merowen_care_deodorant_v05.jpg",
    price: "$58",
  },
  {
    handle: "peptide-cream",
    code: "FC/10",
    title: "Peptide Cream",
    step: "Skin",
    scent: "Kilda",
    size: "50 ml",
    line: "Morning and night. Firm ground.",
    description:
      "Morning and night, a pea's worth. Signal peptides and copper tripeptide for firmer-looking skin; silk protein and ceramides to hold the line. Kilda, or nothing.",
    keyIngredients: ["Signal peptides", "Copper tripeptide", "Hydrolysed silk protein", "Ceramides", "Squalane"],
    use: "Press a pea-sized amount into clean skin, morning and night. Follow with Night Oil in the evening.",
    packaging: "Chamfered obsidian glass jar, blackened-steel lid",
    freeFrom: ["Fragrance allergens in the unscented version", "Mineral oil", "Silicones"],
    options: ["Kilda", "Unscented"],
    image: "merowen_care_peptide_v05.jpg",
    price: "$120",
  },
];

export const careSteps: CareStep[] = ["Shave", "Hair", "Skin", "Body"];

export function getCareProduct(handle: string): CareProduct | null {
  return careLine.find((p) => p.handle === handle) ?? null;
}

/** Scent swatch colours, matching each posting's liquid. */
export const scentColor: Record<CareProduct["scent"], string> = {
  Mirbat: "#5E4636",
  Azrou: "#6F6553",
  Torbeck: "#46483F",
  Kilda: "#5A646A",
};

export const scentNumber: Record<CareProduct["scent"], string> = {
  Mirbat: "01",
  Azrou: "02",
  Torbeck: "03",
  Kilda: "04",
};
