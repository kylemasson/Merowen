import Link from "next/link";
import { CareTeaserCard, RangeCard } from "@/components/Cards";
import { CoordLine } from "@/components/CoordLine";
import { FindYourHour } from "@/components/FindYourHour";
import { HeroMedia } from "@/components/HeroMedia";
import { InnerCircleForm } from "@/components/InnerCircleForm";
import { HERO_FILM, RANGE, careItem, media, posting } from "@/lib/catalog";

const PROOFS = [
  { k: "Natural-origin index", v: "Calculated to ISO 16128 and printed on every label." },
  { k: "Named sourcing regions", v: "Dhofar. The Middle Atlas. Sud, Haiti. Atlantic Scotland." },
  { k: "Batch-dated flacons", v: "Batch and maceration date engraved on the steel collar." },
  { k: "A lifetime refill", v: "A 200 ml flask for every posting. Return the empty." },
];

const CARE_TEASER = ["aftershave-balm", "shampoo", "basalt-face-wash", "deodorant"].map((h) => careItem(h)!);

export default function HomePage() {
  const mirbat = posting("mirbat")!;
  return (
    <main>
      <section className="hero" aria-label="Merowen">
        <HeroMedia
          still={media("merowen_brand_hero_v05.jpg")}
          stillMobile={media("merowen_hero_mobile_v05.jpg")}
          film={HERO_FILM}
          alt="Mirbat on wet basalt at night"
        />
        <div className="hero__inner">
          <div className="hero__copy">
            <div className="eyebrow eyebrow--stone">Park City, Utah</div>
            <h1 className="h1">
              Composed in the wild. <em>Worn in the dark.</em>
            </h1>
            <p className="lede">
              Four Eaux de Parfum. Each names one place, one hour and one material, and can be traced to them.
            </p>
            <div className="btn-row">
              <Link href="/range" className="btn btn--primary">
                The Postings
              </Link>
              <Link href="/products/the-dossier" className="btn btn--ghost">
                Begin with the Dossier
              </Link>
            </div>
            <CoordLine posting={mirbat} animate />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="postings-title">
        <div className="wrap stack stack--lg">
          <div className="head-row">
            <div className="head-row__title">
              <div className="eyebrow">The Postings</div>
              <h2 className="h2" id="postings-title">
                A wardrobe of <em>hours.</em>
              </h2>
            </div>
            <p className="copy head-row__aside">
              Four unisex Eaux de Parfum, each tied to one place and one hour. Together they cover a full day.
            </p>
          </div>
          <FindYourHour />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="range-title">
        <div className="wrap stack stack--lg">
          <div className="head-row">
            <div className="head-row__title">
              <div className="eyebrow">The Range</div>
              <h2 className="h2" id="range-title">
                Discover. Wear. Carry. <em>Keep.</em>
              </h2>
            </div>
            <Link href="/range" className="btn btn--ghost btn--start">
              The full range
            </Link>
          </div>
          <div className="cards">
            {RANGE.map((r) => (
              <RangeCard key={r.handle} item={r} tag="role" />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="proof-title">
        <div className="wrap stack stack--lg">
          <h2 className="h2 measure" id="proof-title">
            Traceable to <em>the source.</em>
          </h2>
          <div className="proofs">
            {PROOFS.map((p) => (
              <div className="proof" key={p.k}>
                <div className="proof__k">{p.k}</div>
                <div className="small">{p.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="care-title">
        <div className="wrap stack stack--lg">
          <div className="split split--end">
            <div className="stack">
              <div className="eyebrow">Field Care</div>
              <h2 className="h2 h2--sm" id="care-title">
                The kit <em>behind the scent.</em>
              </h2>
            </div>
            <div className="stack stack--24 measure-sm">
              <p className="lede">
                Ten everyday essentials for shave, hair, skin and body, each scented with one of the four postings so
                it layers with the fragrance.
              </p>
              <Link href="/field-care" className="btn btn--ghost btn--start">
                See Field Care
              </Link>
            </div>
          </div>
          <div className="cards cards--four">
            {CARE_TEASER.map((c) => (
              <CareTeaserCard key={c.handle} item={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="band-title">
        <img
          src={media("merowen_brand_wearers_v01.jpg")}
          alt="Two wearers walking a sea-cliff path at dusk"
          loading="lazy"
          decoding="async"
        />
        <div className="band__scrim" aria-hidden="true" />
        <div className="band__inner">
          <h2 className="display band__title" id="band-title">
            Leave a trace, <em>not a trail.</em>
          </h2>
        </div>
      </section>

      <section className="section section--circle" aria-labelledby="circle-title">
        <div className="wrap split split--end">
          <div className="stack">
            <div className="eyebrow">The Inner Circle</div>
            <h2 className="h2 h2--sm" id="circle-title">
              First word, <em>before the shelf.</em>
            </h2>
          </div>
          <div className="stack stack--24 measure-sm">
            <p className="lede">New postings, numbered Extrait batches and refill reminders. Sent rarely.</p>
            <InnerCircleForm />
          </div>
        </div>
      </section>
    </main>
  );
}
