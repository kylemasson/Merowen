import type { Metadata } from "next";
import Link from "next/link";
import { assets, shopifyImage } from "@/lib/assets";
import { getRangeItem } from "@/lib/fallback";
import { getCareProduct } from "@/lib/fieldcare";

export const metadata: Metadata = {
  title: "The Refill Programme",
  description: "Every Merowen flacon is made to be refilled. A 200 ml flask for every posting, and the empty comes back to us.",
};

const STEPS = [
  ["01", "Choose your posting", "Order the 200 ml Refill flask in Mirbat, Azrou, Torbeck or Kilda."],
  ["02", "Refill the flacon", "[Refill method to confirm with production: funnel, transfer pump or in-store service]"],
  ["03", "Return the empty", "Send the empty flask back with your next order. [Return label and any credit to confirm]"],
];

export default function RefillPage() {
  const refill = getRangeItem("the-refill")!;
  const deo = getCareProduct("deodorant")!;
  return (
    <>
      <section className="page" style={{ paddingBottom: "clamp(64px, 8vw, 112px)" }}>
        <div className="wrap split">
          <div className="stack stack--28">
            <p className="eyebrow">The Refill Programme</p>
            <h1 className="display h1">
              Kept <em>for life.</em>
            </h1>
            <p className="lead" style={{ maxWidth: 460 }}>
              Every flacon is made to be refilled. There is a 200 ml flask for every posting, and the empty comes back to
              us.
            </p>
            <Link href="/products/the-refill" className="btn btn--primary self-start">
              The Refill <span className="price-inline">— {refill.price}</span>
            </Link>
          </div>
          <div className="frame ratio-11">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shopifyImage(assets.range["the-refill"], 1400)} alt="The 200 ml Refill flask" />
          </div>
        </div>
      </section>

      <section className="section section--alt" style={{ paddingBlock: "clamp(64px, 9vw, 128px)" }} aria-label="How it works">
        <ol className="wrap proofs" style={{ padding: 0, listStyle: "none", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}>
          {STEPS.map(([n, k, v]) => (
            <li key={n} className="proof" style={{ gap: 16 }}>
              <span className="proof__n">{n}</span>
              <h2 className="proof__title">{k}</h2>
              <p className="small">{v}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" style={{ paddingBlock: "clamp(64px, 9vw, 128px)" }}>
        <Link href="/products/deodorant" className="wrap feature">
          <div className="frame ratio-45">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shopifyImage(deo.image, 900)} alt="The Deodorant in its blackened-steel case" loading="lazy" decoding="async" />
          </div>
          <div className="stack" style={{ gap: 18, maxWidth: 440 }}>
            <p className="eyebrow">Field Care · {deo.code}</p>
            <p className="display h2--xs">
              The case <em>refills too.</em>
            </p>
            <p className="body">
              The Deodorant lives in a refillable blackened-steel twist case. Refills come in paper-based tubes.
            </p>
            <p className="mono">CASE $58 · REFILL $22</p>
          </div>
        </Link>
      </section>
    </>
  );
}
