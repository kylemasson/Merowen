import type { Metadata } from "next";
import Link from "next/link";
import { PostingCard, RangeCard } from "@/components/Cards";
import { getPostings } from "@/lib/shopify";
import { rangeItems } from "@/lib/fallback";
import { getCareProduct } from "@/lib/fieldcare";
import { shopifyImage } from "@/lib/assets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Range",
  description: "The four Postings, the Dossier, the Extrait, the Field Kit and the Refill.",
};

export default async function RangePage() {
  const { products: postings } = await getPostings();
  const teaser = ["aftershave-balm", "shampoo", "face-wash"].map((h) => getCareProduct(h)!).filter(Boolean);

  return (
    <div className="page">
      <div className="wrap flow flow--loose">
        <div className="stack" style={{ maxWidth: 720 }}>
          <p className="eyebrow">The Range</p>
          <h1 className="display h1">
            One place, <em>one hour,</em> one material.
          </h1>
        </div>

        <section className="flow" style={{ gap: 32 }} aria-labelledby="postings-title">
          <div className="list-head">
            <h2 id="postings-title" className="display h3">
              The Postings
            </h2>
            <span className="mono mono--ash">EAU DE PARFUM · 50 / 100 ML</span>
          </div>
          <div className="cards">
            {postings.map((p) => (
              <PostingCard key={p.handle} p={p} />
            ))}
          </div>
        </section>

        <section className="flow" style={{ gap: 32 }} aria-labelledby="range-title">
          <div className="list-head">
            <h2 id="range-title" className="display h3">
              Discover. Wear. Carry. Keep.
            </h2>
          </div>
          <div className="cards">
            {rangeItems.map((r) => (
              <RangeCard key={r.handle} r={r} />
            ))}
          </div>
        </section>

        <Link href="/field-care" className="teaser">
          <div className="stack" style={{ gap: 16 }}>
            <p className="eyebrow">FC/01 – FC/10</p>
            <p className="display h2--xs">Field Care</p>
            <p className="small" style={{ maxWidth: 400 }}>
              Ten everyday essentials for shave, hair, skin and body, each scented with one of the four postings.
            </p>
          </div>
          <div className="teaser__imgs">
            {teaser.map((c) => (
              <div key={c.handle} className="frame ratio-45">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shopifyImage(c.image, 600)} alt={c.title} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </Link>
      </div>
    </div>
  );
}
