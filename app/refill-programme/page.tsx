import type { Metadata } from "next";
import Link from "next/link";
import { REFILL, TRAVEL_SPRAY, money } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "The Refill Programme",
  description: "Every Merowen flacon is made to be refilled, with a 200 ml flask for every posting.",
};

const STEPS = [
  { n: "01", k: "Choose your posting", v: "Order the 200 ml Refill flask in Blackfriars, Guardsman, Mayfair or Empire." },
  { n: "02", k: "Refill the flacon", v: "Lift the cap, unscrew the pump, and pour through the steel funnel that ships with the flask. Screw the pump back on. It takes under a minute." },
  { n: "03", k: "Return the empty", v: "Send the empty flask back in its own box with the prepaid label. The flask is cleaned and refilled; you receive a credit toward your next order." },
];

export default function RefillPage() {
  return (
    <main>
      <section className="page page--hero">
        <div className="wrap split">
          <div className="stack stack--28">
            <div className="eyebrow">The Refill Programme</div>
            <h1 className="h1 h1--page">
              Kept <em>for life.</em>
            </h1>
            <p className="lede measure-sm">
              Every flacon is made to be refilled. There is a 200 ml flask for every posting, and the empty comes back
              to us.
            </p>
            <Link href={`/products/${REFILL.handle}`} className="btn btn--primary btn--start">
              The Refill — <span className="btn__price">{money(REFILL.price)}</span>
            </Link>
          </div>
          <div className="frame frame--11">
            <img src={REFILL.image} alt="The 200 ml Refill flask" decoding="async" />
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-label="How it works">
        <div className="wrap steps">
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <div className="mono mono--pewter">{s.n}</div>
              <div className="step__k">{s.k}</div>
              <p className="small">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <Link href={`/products/${TRAVEL_SPRAY.handle}`} className="wrap deo-link">
          <div className="frame frame--45">
            <img src={TRAVEL_SPRAY.image} alt="The Travel Spray in its gunmetal case" loading="lazy" decoding="async" />
          </div>
          <div className="stack measure-sm">
            <div className="eyebrow">The Travel Spray · {TRAVEL_SPRAY.format}</div>
            <div className="display h2--md">
              The case <em>refills too.</em>
            </div>
            <p className="copy">
              A satin gunmetal case around a 10 ml glass spray refill. When the refill runs out, swap it and keep the case.
            </p>
            <div className="mono">{money(TRAVEL_SPRAY.price)}</div>
          </div>
        </Link>
      </section>
    </main>
  );
}
