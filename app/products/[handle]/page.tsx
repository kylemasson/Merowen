import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bottle } from "@/components/Bottle";
import { CareCard, PostingCard } from "@/components/Cards";
import { CoordLine, postingLeft, postingRight } from "@/components/CoordLine";
import { ProductBuy, type BuyOption } from "@/components/ProductBuy";
import { ProductMedia } from "@/components/ProductMedia";
import { assets, shopifyImage } from "@/lib/assets";
import { fallbackPostings, getRangeItem, libraryImage } from "@/lib/fallback";
import { careLine, getCareProduct, scentColor, scentNumber } from "@/lib/fieldcare";
import { getPostings, getProduct } from "@/lib/shopify";
import type { Product, Variant } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ handle: string }> };

const SHIPPING = "[Shipping and returns policy, pulled from Shopify]";

const FLACON =
  "Extra-clear flint glass with chamfered edges, cut like a gemstone; the lower third is opaque matte black glass fading up into clear, over a solid base. A tall solid blackened-steel cap in satin gunmetal, knurled like a dive-watch crown, its domed top engraved with the M seal, sits over a slim steel neck collar engraved with posting, hour, batch and date. No paper label: the name is printed on the glass in raised bone ink and the coordinates are etched into the base.";

const BOX =
  "Uncoated black FSC board, blind-debossed seal, coordinate line printed in bone ink, magnetic close. No foil, no plastic insert.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const care = getCareProduct(handle);
  if (care) return { title: `${care.title} — Field Care`, description: `${care.line} ${care.description}` };
  const range = getRangeItem(handle);
  const product = await getProduct(handle);
  if (!product && range) return { title: range.title, description: `${range.line} ${range.body}` };
  if (!product) return { title: "Not found" };
  const p = product.posting;
  return {
    title: p ? `${product.title} — Posting ${p.number}` : product.title,
    description: p ? `${p.line} ${p.heroMaterial}. ${product.description}` : product.description,
    openGraph: product.image ? { images: [product.image] } : undefined,
  };
}

/** Turns Shopify variants (or planned options on demo data) into buy options. */
function buyOptions(
  variants: Variant[],
  fallback: { labels?: string[]; subs?: string[]; price: string | null },
  barSub: (label: string) => string,
): BuyOption[] {
  if (variants.length) {
    return variants.map((v) => ({
      label: v.title,
      sub: variants.length > 1 ? v.price : null,
      variantId: v.id,
      available: v.available,
      price: v.price ?? fallback.price,
      barSub: barSub(v.title),
    }));
  }
  const labels = fallback.labels?.length ? fallback.labels : [""];
  return labels.map((label, i) => ({
    label,
    sub: fallback.subs?.[i] ?? fallback.price,
    variantId: null,
    available: false,
    price: fallback.price,
    barSub: barSub(label),
  }));
}

function Specs({ rows }: { rows: { k: string; v: string; swatch?: string; mono?: boolean }[] }) {
  return (
    <dl className="rows">
      {rows.map((r) => (
        <div key={r.k} className="row">
          <dt className="row__k">{r.k}</dt>
          <dd className={r.mono ? "row__v row__v--mono" : "row__v"}>
            {r.swatch ? <span className="swatch swatch--12" style={{ background: r.swatch }} aria-hidden="true" /> : null}
            <span>{r.v}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Details({ items }: { items: [string, string][] }) {
  return (
    <div className="accordion">
      {items.map(([title, body]) => (
        <details key={title}>
          <summary>{title}</summary>
          <p>{body}</p>
        </details>
      ))}
    </div>
  );
}

function Titles({ crumb, eyebrow, name, line }: { crumb: { href: string; label: string }; eyebrow: string; name: string; line: string }) {
  return (
    <>
      <Link href={crumb.href} className="crumb">
        ← {crumb.label}
      </Link>
      <div className="product__titles">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display product__name">{name}</h1>
        <p className="product__line">{line}</p>
      </div>
    </>
  );
}

function capital(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const care = getCareProduct(handle);
  const range = getRangeItem(handle);
  const product = await getProduct(handle);

  /* ---------------------------------------------------------------- */
  /* Field Care                                                        */
  /* ---------------------------------------------------------------- */
  if (care) {
    const options = buyOptions(product?.variants ?? [], { labels: care.options, price: care.price }, (l) =>
      [care.code, l || care.size].join(" · ").toUpperCase(),
    );
    const also = careLine.filter((p) => p.step === care.step && p.handle !== care.handle);
    return (
      <div className="product">
        <div className="wrap flow flow--loose">
          <div className="product__grid">
            <ProductMedia images={[product?.image ?? shopifyImage(care.image, 1400)]} alt={`${care.title}, ${care.size}`} />
            <div className="product__body">
              <Titles crumb={{ href: "/field-care", label: "Field Care" }} eyebrow={`Field Care · ${care.code}`} name={care.title} line={care.line} />
              <p className="lead">
                {care.description} Scented with {care.scent}, so it layers with the fragrance.
              </p>
              <ProductBuy name={care.title} options={options} optionLabel={care.options ? "Scent" : "Format"} />
              <Specs
                rows={[
                  { k: "Step", v: care.step },
                  { k: "Scent", v: `${care.scent} · ${scentNumber[care.scent]}`, swatch: scentColor[care.scent] },
                  { k: "Size", v: care.size, mono: true },
                  { k: "Key ingredients", v: care.keyIngredients.join(", ") },
                  { k: "Vessel", v: care.packaging },
                ]}
              />
              <Details
                items={[
                  ["How to use", care.use],
                  ["Free from", care.freeFrom.join(" · ")],
                  ["Full ingredients", "[Final INCI list from the formulator, after regulatory review]"],
                  ["Shipping and returns", SHIPPING],
                ]}
              />
            </div>
          </div>

          {also.length ? (
            <section className="flow" style={{ gap: 32 }} aria-labelledby="also-title">
              <div className="list-head">
                <h2 id="also-title" className="display h3">
                  Also for {care.step.toLowerCase()}
                </h2>
                <span className="mono mono--ash">FIELD CARE</span>
              </div>
              <div className="cards cards--220">
                {also.map((p) => (
                  <CareCard key={p.handle} p={p} mini />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Postings                                                          */
  /* ---------------------------------------------------------------- */
  if (product?.posting) {
    const p = product.posting;
    const name = product.title;
    const options = buyOptions(product.variants, { price: null }, (l) => `EDP · ${l}`.toUpperCase());
    const { products: all } = await getPostings();
    const others = (all.length ? all : fallbackPostings).filter((x) => x.handle !== product.handle);
    const layers = careLine.filter((c) => c.scent.toLowerCase() === product.handle);
    const images = [product.image, libraryImage(product.handle), shopifyImage(assets.box, 1400)].filter(
      (x, i, arr): x is string => Boolean(x) && arr.indexOf(x) === i,
    );
    const provenance = [
      ["Perfumer", p.perfumer],
      ["Source", p.source],
      ["Producer", p.producer],
      ["Composed", p.composedIn],
      ["Bottled", p.bottledIn],
    ].filter((r): r is [string, string] => Boolean(r[1]));

    return (
      <div className="product">
        <div className="wrap flow flow--loose">
          <div className="product__grid">
            <ProductMedia
              images={images}
              alt={product.imageAlt || `${name} flacon`}
              film={p.film}
              fallback={<Bottle liquid={p.liquid} label={`${p.coordinates} — ${p.hour}`} title={`${name} flacon`} />}
            />
            <div className="product__body">
              <Titles crumb={{ href: "/range", label: "The Postings" }} eyebrow={`Posting ${p.number} · Eau de Parfum`} name={name} line={p.line} />
              <CoordLine type left={postingLeft(p.number, name)} right={postingRight(p.coordinates, p.hour)} />
              <p className="lead">{product.description}</p>
              <ProductBuy name={name} options={options} note="Began with the Dossier? Enter the code from its card in the bag." />
              <Specs
                rows={[
                  { k: "Hero material", v: p.heroMaterial },
                  { k: "Family", v: p.family },
                  { k: "Top", v: p.top },
                  { k: "Heart", v: p.heart },
                  { k: "Base", v: p.base },
                  { k: "Liquid", v: p.liquid.toUpperCase(), swatch: p.liquid, mono: true },
                ]}
              />
              <Details
                items={[
                  ["The flacon", FLACON],
                  ["The box", BOX],
                  ["Ingredients and natural-origin index", "[Final INCI list and ISO 16128 natural-origin figure from the formulator]"],
                  ["Shipping and returns", SHIPPING],
                ]}
              />
              {provenance.length ? (
                <section className="provenance" aria-label="Provenance">
                  <div className="list-head" style={{ paddingBottom: 0, borderBottom: 0 }}>
                    <p className="eyebrow">Provenance</p>
                    {p.batch ? <span className="mono mono--pewter" style={{ fontSize: 11 }}>{p.batch.toUpperCase()}</span> : null}
                  </div>
                  <dl className="rows">
                    {provenance.map(([k, v]) => (
                      <div key={k} className="row row--tight">
                        <dt className="row__k">{k}</dt>
                        <dd className="row__v row__v--soft">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}
            </div>
          </div>

          {layers.length ? (
            <section className="flow" style={{ gap: 32 }} aria-labelledby="layers-title">
              <div className="list-head">
                <h2 id="layers-title" className="display h3">
                  Layers with {capital(name)}
                </h2>
                <span className="mono mono--ash">FIELD CARE</span>
              </div>
              <div className="cards cards--220">
                {layers.map((c) => (
                  <CareCard key={c.handle} p={c} mini />
                ))}
              </div>
            </section>
          ) : null}

          <OtherPostings postings={others} title="The other postings" />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* The Range (and any other Shopify product)                         */
  /* ---------------------------------------------------------------- */
  if (!range && !product) notFound();
  const name = product?.title ?? range!.title;
  const isRefill = handle === "the-refill";
  const isDossier = handle === "the-dossier";
  const postings = isDossier ? (await getPostings()).products : [];
  const options = buyOptions(
    product?.variants ?? [],
    {
      labels: isRefill ? fallbackPostings.map((x) => x.title.toUpperCase()) : undefined,
      subs: isRefill ? fallbackPostings.map((x) => `${x.posting!.number} · ${x.posting!.hour}`) : undefined,
      price: range?.price ?? null,
    },
    (l) => [range?.format ?? "", l].filter(Boolean).join(" · ").toUpperCase(),
  );
  const note = range?.preparing
    ? "Joins the range once the core postings sell through."
    : isDossier
      ? "Arrives with a single-use code that credits the price toward your first flacon."
      : isRefill
        ? "Return the empty flask with your next order."
        : undefined;
  const image = product?.image ?? libraryImage(handle);

  return (
    <div className="product">
      <div className="wrap flow flow--loose">
        <div className="product__grid">
          <ProductMedia images={image ? [image] : []} alt={name} ratio="11" />
          <div className="product__body">
            <Titles
              crumb={{ href: "/range", label: "The Range" }}
              eyebrow={range ? `${range.role} · ${range.format}` : "Merowen"}
              name={name}
              line={range?.line ?? ""}
            />
            <p className="lead">{range?.body ?? product?.description}</p>
            <ProductBuy
              name={name}
              options={options}
              optionLabel={isRefill ? "Posting" : "Option"}
              note={note}
              preparing={range?.preparing}
              more={isRefill ? { href: "/refill-programme", label: "How the programme works" } : undefined}
            />
            {range ? (
              <Specs
                rows={[
                  { k: "Format", v: range.format },
                  { k: "Price", v: options[0]?.price ?? range.price, mono: true },
                ]}
              />
            ) : null}
            <Details items={[["Shipping and returns", SHIPPING]]} />
          </div>
        </div>
        {isDossier ? <OtherPostings postings={postings} title="Inside the Dossier" /> : null}
      </div>
    </div>
  );
}

function OtherPostings({ postings, title }: { postings: Product[]; title: string }) {
  if (!postings.length) return null;
  return (
    <section className="flow" style={{ gap: 32 }} aria-labelledby="others-title">
      <div className="list-head">
        <h2 id="others-title" className="display h3">
          {title}
        </h2>
      </div>
      <div className="cards cards--240">
        {postings.map((p) => (
          <PostingCard key={p.handle} p={p} small showPrice={false} />
        ))}
      </div>
    </section>
  );
}
