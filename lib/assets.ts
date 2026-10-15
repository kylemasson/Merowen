/**
 * Merowen photography library. The v05 images ship with the site in
 * `public/media/` (served by Cloudflare as static assets), so every page has
 * its imagery before anything is uploaded to Shopify. Once a product carries
 * its own image in Shopify, that image wins (see `lib/shopify.ts`).
 * Bump the `_vNN` suffix when replacing a photo.
 */
const MEDIA = "/media/";

/** URL for a library image. `width` is accepted for Shopify-hosted files later; local files are served as-is. */
export function shopifyImage(file: string, _width?: number): string {
  if (/^https?:\/\//.test(file)) return file;
  return `${MEDIA}${file}`;
}

export const assets = {
  heroDesktop: "merowen_brand_hero_v05.jpg",
  heroMobile: "merowen_hero_mobile_v05.jpg",
  master: "merowen_master_mirbat_v05.jpg",
  postings: {
    mirbat: "merowen_master_mirbat_v05.jpg",
    azrou: "merowen_master_azrou_v05.jpg",
    torbeck: "merowen_master_torbeck_v05.jpg",
    kilda: "merowen_master_kilda_v05.jpg",
  } as Record<string, string>,
  range: {
    "the-dossier": "merowen_range_dossier_v05.jpg",
    "mirbat-extrait": "merowen_range_extrait_v05.jpg",
    "the-field-kit": "merowen_range_fieldkit_v05.jpg",
    "the-refill": "merowen_range_refill_v05.jpg",
  } as Record<string, string>,
  box: "merowen_pack_box_v05.jpg",
  wearers: "merowen_brand_wearers_v01.jpg",
  ritual: "merowen_care_ritual_v05.jpg",
};
