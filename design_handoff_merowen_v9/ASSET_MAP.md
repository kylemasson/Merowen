# Asset map: file → Shopify (v9)

Upload every file in `design/assets/` and `design/films/` to **Content → Files**, keeping the filenames. `lib/assets.ts` resolves these names through `shopifyImage()`.

## Postings
| Product handle | Image 1 (featured) | Image 2 (in box) | `merowen.film` | kind | coords · hour |
|---|---|---|---|---|---|
| blackfriars | merowen_master_blackfriars_v08.jpg | merowen_box_blackfriars_v08.jpg | merowen_film_blackfriars_v09.mp4 | city | 51.51°N 0.10°W · 23:00 |
| guardsman | merowen_master_guardsman_v08.jpg | merowen_box_guardsman_v08.jpg | merowen_film_guardsman_v09.mp4 | mountain | 40.61°N 111.55°W · 06:00 |
| mayfair | merowen_master_mayfair_v08.jpg | merowen_box_mayfair_v08.jpg | merowen_film_mayfair_v09.mp4 | city | 51.51°N 0.15°W · 17:00 |
| empire | merowen_master_empire_v08.jpg | merowen_box_empire_v08.jpg | merowen_film_empire_v09.mp4 | mountain | 40.60°N 111.52°W · 20:00 |

New metafields: `merowen.kind` (mountain | city), `merowen.place`, `merowen.origin`. Liquid colours: Blackfriars #5E4636 · Guardsman #6F6553 · Mayfair #46483F · Empire #5A646A.

## Range
the-dossier → merowen_range_dossier_v05.jpg · blackfriars-extrait → merowen_range_extrait_v05.jpg · the-field-kit → merowen_range_fieldkit_v05.jpg · the-refill → merowen_range_refill_v05.jpg

## Field Care
One image per handle: `merowen_care_<handle>_v05.jpg`. `merowen_care_ritual_v05.jpg` on the Field Care page's morning-shave block (Shave Cream in Guardsman, Balm in Blackfriars, Tonic in Empire).

## Home metaobject (`home_page`, handle `home`)
hero_film_desktop → merowen_hero_film_desktop_v08e.mp4 · hero_poster → merowen_brand_hero_v08.jpg · hero_film_mobile → *(pending; phones show merowen_hero_mobile_v05.jpg)*

## Brand
merowen_brand_wearers_v09.jpg → the Wearers band on home (ridgeline above Park City).

## Transcode films before upload
```bash
for f in design/films/*.mp4; do ffmpeg -i "$f" -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart "${f%.mp4}_web.mp4"; done
```
