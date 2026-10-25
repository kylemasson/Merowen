import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CareCard, PostingCard } from "@/components/Cards";
import { CoordLine } from "@/components/CoordLine";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductMedia } from "@/components/ProductMedia";
import {
  BOX_COPY,
  CARE,
  FLACON_COPY,
  INGREDIENTS_COPY,
  POSTINGS,
  SHIPPING_COPY,
  careItem,
  money,
  posting,
  rangeItem,
} from "@/lib/catalog";
import { getOffer } from "@/lib/offers";

type Props = { params: Promise<{ handle: string }> };

type Spec = { k: string; v: string; swatch?: string; mono?: boolean };
type Detail = { title: string; body: string };

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const p = posting(handle);
  const r = rangeItem(handle);
  const c = careItem(handle);
  const item = p ?? r ?? c;
  if (!item) return { title: "Not found" };
  const description = p?.desc ?? r?.desc ?? c?.note;
  return { title: item.name, description, openGraph: { images: [p?.image ?? r?.image ?? c?.image ?? ""] } };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const p = posting(handle);
  const r = rangeItem(handle);
  const c = careItem(handle);
  if (!p && !r && !c) notFound();
  const offer = await getOffer(handle);
  if (!offer) notFound();

  if (p) {
    const images = [p.image, ...p.extras, p.box];
    const layers = CARE.filter((x) => x.scent === p.handle);
    const specs: Spec[] = [
      { k: "Hero material", v: p.material },
      { k: "Family", v: p.family },
      { k: "Top", v: p.top },
      { k: "Heart", v: p.heart },
      { k: "Base", v: p.base },
      { k: "Liquid", v: p.liquid.toUpperCase(), swatch: p.liquid, mono: true },
    ];
    const details: Detail[] = [
      { title: "The flacon", body: FLACON_COPY },
      { title: "The box", body: BOX_COPY },
      { title: "Ingredients and natural-origin index", body: INGREDIENTS_COPY },
      { title: "Shipping and returns", body: SHIPPING_COPY },
    ];
    const provenance: Spec[] = [
      { k: p.kind === "city" ? "Composed for" : "From", v: p.place },
      { k: "Material origin", v: p.origin },
      { k: "Source", v: p.source },
      { k: "Producer", v: p.producer },
      { k: "Composed", v: "In Park City, Utah. Perfumer named on the batch card." },
      { k: "Filled", v: "Macerated, chilled and filtered at a GMP fragrance filler in the United States" },
      { k: "Concentration", v: `Eau de Parfum, ${p.strength} · 50 ml and 100 ml, and the 10 ml Travel Spray` },
    ];
    return (
      <main className="pdp">
        <div className="wrap stack stack--pdp">
          <div className="pdp__grid">
            <ProductMedia name={`${p.name} flacon`} images={images} film={offer.film ?? p.film} ratio="45" />
            <div className="pdp__info">
              <Link href="/range" className="crumb">
                ← THE POSTINGS
              </Link>
              <Title eyebrow={`Posting ${p.num} · Eau de Parfum`} name={p.name} line={p.line} />
              <CoordLine posting={p} animate />
              <p className="lede">{p.desc}</p>
              <ProductBuy
                name={p.name}
                optionLabel={offer.optionLabel}
                options={offer.options}
                preparing={false}
                note="Began with the Dossier? Enter the code from its card in the bag."
                barSubs={offer.options.map((o) => `EDP · ${o.label}`.toUpperCase())}
              />
              <Specs specs={specs} />
              <Details details={details} />
              <section className="prov" aria-labelledby="prov-title">
                <div className="prov__head">
                  <h2 className="eyebrow" id="prov-title">
                    Provenance
                  </h2>
                  <span className="mono mono--pewter">BATCH 01 · 2026 · {p.coords}</span>
                </div>
                <Specs specs={provenance.filter((s) => s.v)} prov />
              </section>
            </div>
          </div>

          {layers.length > 0 && (
            <section className="stack stack--32" aria-labelledby="layers-title">
              <div className="rule-head">
                <h2 className="h3" id="layers-title">
                  Layers with {titleCase(p.name)}
                </h2>
                <span className="mono mono--ash">FIELD CARE</span>
              </div>
              <div className="cards cards--tight">
                {layers.map((x) => (
                  <CareCard key={x.handle} item={x} compact />
                ))}
              </div>
            </section>
          )}

          <section className="stack stack--32" aria-labelledby="others-title">
            <div className="rule-head">
              <h2 className="h3" id="others-title">
                The other postings
              </h2>
            </div>
            <div className="cards cards--tight">
              {POSTINGS.filter((x) => x.handle !== p.handle).map((x) => (
                <PostingCard key={x.handle} posting={x} size="md" showPrice={false} />
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (r) {
    const first = offer.options[0];
    const note = r.preparing
      ? "Joins the range once the core postings sell through."
      : r.handle === "the-dossier"
        ? "Arrives with a single-use code that credits the price toward your first flacon."
        : r.handle === "the-travel-spray"
          ? "When the refill runs out, order a new one and keep the case."
          : "Return the empty flask with your next order.";
    return (
      <main className="pdp">
        <div className="wrap stack stack--pdp">
          <div className="pdp__grid">
            <ProductMedia name={r.name} images={[r.image]} ratio="11" />
            <div className="pdp__info">
              <Link href="/range" className="crumb">
                ← THE RANGE
              </Link>
              <Title eyebrow={`${r.role} · ${r.format}`} name={r.name} line={r.line} />
              <p className="lede">{r.desc}</p>
              <ProductBuy
                name={r.name}
                optionLabel={offer.optionLabel}
                options={offer.options}
                preparing={Boolean(r.preparing)}
                note={note}
                barSubs={offer.options.map((o) =>
                  (r.byPosting ? `${r.format} · ${o.label}` : r.format).toUpperCase(),
                )}
                more={r.handle === "the-refill" ? { label: "How the programme works", href: "/refill-programme" } : undefined}
              />
              <Specs
                specs={[
                  { k: "Format", v: r.format },
                  { k: "Price", v: money(first?.price ?? r.price, first?.currency), mono: true },
                ]}
              />
              <Details details={[{ title: "Shipping and returns", body: SHIPPING_COPY }]} />
            </div>
          </div>
          {r.handle === "the-dossier" && (
            <section className="stack stack--32" aria-labelledby="inside-title">
              <div className="rule-head">
                <h2 className="h3" id="inside-title">
                  Inside the Dossier
                </h2>
              </div>
              <div className="cards cards--tight">
                {POSTINGS.map((x) => (
                  <PostingCard key={x.handle} posting={x} size="md" showPrice={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    );
  }

  const care = c!;
  const scent = posting(care.scent)!;
  const also = CARE.filter((x) => x.step === care.step && x.handle !== care.handle);
  return (
    <main className="pdp">
      <div className="wrap stack stack--pdp">
        <div className="pdp__grid">
          <ProductMedia name={care.name} images={[care.image]} ratio="45" />
          <div className="pdp__info">
            <Link href="/field-care" className="crumb">
              ← FIELD CARE
            </Link>
            <Title eyebrow={`Field Care · ${care.code}`} name={care.name} line={care.line} />
            <p className="lede">
              {care.note} Scented with {titleCase(scent.name)}, so it layers with the fragrance.
            </p>
            <ProductBuy
              name={care.name}
              optionLabel={offer.optionLabel}
              options={offer.options}
              preparing={Boolean(care.preparing)}
              note={care.preparing ? "Joins Field Care after the first batch." : null}
              barSubs={offer.options.map((o) => `${care.code} · ${o.label}`.toUpperCase())}
            />
            <Specs
              specs={[
                { k: "Step", v: care.step },
                { k: "Scent", v: `${scent.name} · ${scent.num}`, swatch: scent.liquid },
                { k: "Size", v: care.size, mono: true },
                { k: "Key ingredients", v: care.keys },
                { k: "Vessel", v: care.vessel },
              ]}
            />
            <Details
              details={[
                { title: "Full ingredients", body: INGREDIENTS_COPY },
                { title: "Shipping and returns", body: SHIPPING_COPY },
              ]}
            />
          </div>
        </div>
        {also.length > 0 && (
          <section className="stack stack--32" aria-labelledby="also-title">
            <div className="rule-head">
              <h2 className="h3" id="also-title">
                Also for {care.step.toLowerCase()}
              </h2>
              <span className="mono mono--ash">FIELD CARE</span>
            </div>
            <div className="cards cards--tight">
              {also.map((x) => (
                <CareCard key={x.handle} item={x} compact />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Title({ eyebrow, name, line }: { eyebrow: string; name: string; line: string }) {
  return (
    <div className="stack stack--18">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="h1 name pdp__title">{name}</h1>
      <p className="pdp__line">{line}</p>
    </div>
  );
}

function Specs({ specs, prov = false }: { specs: Spec[]; prov?: boolean }) {
  return (
    <dl className="specs">
      {specs.map((s) => (
        <div key={s.k} className={prov ? "spec spec--prov" : "spec"}>
          <dt className="spec__k">{s.k}</dt>
          <dd className={s.mono ? "spec__v spec__v--mono" : "spec__v"}>
            {s.swatch && <span className="swatch swatch--12" style={{ background: s.swatch }} aria-hidden="true" />}
            <span>{s.v}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Details({ details }: { details: Detail[] }) {
  return (
    <div className="accordion">
      {details.map((d) => (
        <details key={d.title}>
          <summary>{d.title}</summary>
          <p>{d.body}</p>
        </details>
      ))}
    </div>
  );
}
