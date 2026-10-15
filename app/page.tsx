import Link from "next/link";
import { HeroFilm } from "@/components/HeroFilm";
import { InnerCircle } from "@/components/InnerCircle";
import { FindYourHour } from "@/components/FindYourHour";
import { CareTile, RangeCard } from "@/components/Cards";
import { CoordLine, postingLeft, postingRight } from "@/components/CoordLine";
import { getHomeMedia, getPostings } from "@/lib/shopify";
import { assets, shopifyImage } from "@/lib/assets";
import { rangeItems } from "@/lib/fallback";
import { getCareProduct } from "@/lib/fieldcare";

// Prices, stock and films come live from Shopify on each request.
export const dynamic = "force-dynamic";

const PROOFS = [
  { k: "Natural-origin index", v: "Calculated to ISO 16128 and printed on every label." },
  { k: "Named sourcing regions", v: "Dhofar. The Middle Atlas. Sud, Haiti. Atlantic Scotland." },
  { k: "Batch-dated flacons", v: "Batch and maceration date engraved on the steel collar." },
  { k: "A lifetime refill", v: "A 200 ml flask for every posting. Return the empty." },
];

const HOME_CARE = ["aftershave-balm", "shampoo", "face-wash", "deodorant"];

export default async function Home() {
  const [{ products: postings }, media] = await Promise.all([getPostings(), getHomeMedia()]);
  const lead = postings.find((p) => p.handle === "mirbat") ?? postings[0];
  const lp = lead.posting!;

  return (
    <>
      <section className="hero" aria-label="Merowen">
        <HeroFilm
          media={media}
          stills={{
            desktop: media.poster ?? shopifyImage(assets.heroDesktop, 2400),
            mobile: shopifyImage(assets.heroMobile, 1200),
            alt: "The Mirbat flacon on wet basalt by the sea at night",
          }}
        />
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">Park City, Utah</p>
            <h1 className="display hero__title">
              Composed in the wild. <em>Worn in the dark.</em>
            </h1>
            <p className="lead hero__lead">
              Four Eaux de Parfum. Each names one place, one hour and one material, and can be traced to them.
            </p>
            <div className="hero__ctas">
              <Link href="/range" className="btn btn--primary">
                The Postings
              </Link>
              <Link href="/products/the-dossier" className="btn btn--ghost">
                Begin with the Dossier
              </Link>
            </div>
            <CoordLine type left={postingLeft(lp.number, lead.title)} right={postingRight(lp.coordinates, lp.hour)} />
          </div>
        </div>
      </section>

      <section id="postings" className="section" aria-labelledby="postings-title">
        <div className="wrap flow">
          <div className="head">
            <div className="stack" style={{ maxWidth: 640 }}>
              <p className="eyebrow">The Postings</p>
              <h2 id="postings-title" className="display h2">
                A wardrobe of <em>hours.</em>
              </h2>
            </div>
            <p className="body head__aside">
              Four unisex Eaux de Parfum, each tied to one place and one hour. Together they cover a full day.
            </p>
          </div>
          <FindYourHour postings={postings} />
        </div>
      </section>

      <section id="range" className="section section--alt" aria-labelledby="range-title">
        <div className="wrap flow">
          <div className="head">
            <div className="stack">
              <p className="eyebrow">The Range</p>
              <h2 id="range-title" className="display h2">
                Discover. Wear. Carry. <em>Keep.</em>
              </h2>
            </div>
            <Link href="/range" className="btn btn--ghost self-start">
              The full range
            </Link>
          </div>
          <div className="cards">
            {rangeItems.map((r) => (
              <RangeCard key={r.handle} r={r} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="proof-title">
        <div className="wrap flow flow--tight">
          <h2 id="proof-title" className="display h2" style={{ maxWidth: 720 }}>
            Traceable to <em>the source.</em>
          </h2>
          <div className="proofs">
            {PROOFS.map((p) => (
              <div key={p.k} className="proof">
                <h3 className="proof__k">{p.k}</h3>
                <p className="small">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="care-title">
        <div className="wrap flow flow--tight">
          <div className="split split--end" style={{ gap: "24px clamp(40px, 6vw, 96px)" }}>
            <div className="stack">
              <p className="eyebrow">Field Care</p>
              <h2 id="care-title" className="display h2--sm">
                The kit <em>behind the scent.</em>
              </h2>
            </div>
            <div className="stack stack--24" style={{ maxWidth: 460 }}>
              <p className="lead">
                Ten everyday essentials for shave, hair, skin and body, each scented with one of the four postings so it
                layers with the fragrance.
              </p>
              <Link href="/field-care" className="btn btn--ghost self-start">
                See Field Care
              </Link>
            </div>
          </div>
          <div className="cards cards--four">
            {HOME_CARE.map((h) => {
              const p = getCareProduct(h);
              return p ? <CareTile key={h} p={p} /> : null;
            })}
          </div>
        </div>
      </section>

      <section className="close-band" aria-labelledby="close-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shopifyImage(assets.wearers, 2400)}
          alt="Two wearers walking a sea-cliff path at dusk"
          loading="lazy"
          decoding="async"
        />
        <div className="close-band__copy">
          <h2 id="close-title" className="display">
            Leave a trace, <em>not a trail.</em>
          </h2>
        </div>
      </section>

      <InnerCircle />
    </>
  );
}
