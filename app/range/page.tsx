import type { Metadata } from "next";
import Link from "next/link";
import { PostingCard, RangeCard } from "@/components/Cards";
import { POSTINGS, RANGE, careItem } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "The Range",
  description: "The four Postings, the Dossier, the Extrait, the Travel Spray, the Field Kit and the Refill.",
};

const TEASER = ["shave-cream", "aftershave-balm", "daily-moisturiser"].map((h) => careItem(h)!);

export default function RangePage() {
  return (
    <main className="page">
      <div className="wrap stack stack--xl">
        <div className="stack measure">
          <div className="eyebrow">The Range</div>
          <h1 className="h1 h1--page">
            One place, <em>one hour,</em> one material.
          </h1>
        </div>

        <section className="stack stack--32" aria-labelledby="range-postings">
          <div className="rule-head">
            <h2 className="h3" id="range-postings">
              The Postings
            </h2>
            <span className="mono mono--ash">EAU DE PARFUM · 50 / 100 ML · 10 ML TRAVEL</span>
          </div>
          <div className="cards">
            {POSTINGS.map((p) => (
              <PostingCard key={p.handle} posting={p} />
            ))}
          </div>
        </section>

        <section className="stack stack--32" aria-labelledby="range-more">
          <div className="rule-head">
            <h2 className="h3" id="range-more">
              Discover. Wear. Carry. Keep.
            </h2>
          </div>
          <div className="cards cards--range">
            {RANGE.map((r) => (
              <RangeCard key={r.handle} item={r} tag="format" />
            ))}
          </div>
        </section>

        <Link href="/field-care" className="care-link">
          <div className="stack">
            <div className="eyebrow">FC/01 – FC/10</div>
            <div className="display h2--md">Field Care</div>
            <p className="small measure-sm">
              Ten everyday essentials for shave, hair, skin and body, each scented with one of the four postings.
            </p>
          </div>
          <div className="care-link__thumbs">
            {TEASER.map((c) => (
              <div className="frame frame--45" key={c.handle}>
                <img src={c.image} alt={c.name} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </Link>
      </div>
    </main>
  );
}
