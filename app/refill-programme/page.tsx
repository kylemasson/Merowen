import type { Metadata } from "next";
import Link from "next/link";
import { REFILL, careItem, media, money } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "The Refill Programme",
  description: "Every Merowen flacon is made to be refilled, with a 200 ml flask for every posting.",
};

const STEPS = [
  { n: "01", k: "Choose your posting", v: "Order the 200 ml Refill flask in Blackfriars, Guardsman, Mayfair or Empire." },
  { n: "02", k: "Refill the flacon", v: "Unscrew the cap, fit the steel transfer nozzle that ships with the flask, and press. The flacon fills in under a minute." },
  { n: "03", k: "Return the empty", v: "Send the empty flask back in its own box with the prepaid label. The flask is cleaned and refilled; you receive a credit toward your next order." },
];

export default function RefillPage() {
  const deo = careItem("deodorant")!;
  const [deoCase, deoRefill] = deo.formats ?? [];
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
        <Link href={`/products/${deo.handle}`} className="wrap deo-link">
          <div className="frame frame--45">
            <img src={media("merowen_care_deodorant_v05.jpg")} alt="Deodorant in its blackened-steel case" loading="lazy" decoding="async" />
          </div>
          <div className="stack measure-sm">
            <div className="eyebrow">Field Care · {deo.code}</div>
            <div className="display h2--md">
              The case <em>refills too.</em>
            </div>
            <p className="copy">
              The Deodorant lives in a refillable blackened-steel twist case. Refills come in paper-based tubes.
            </p>
            <div className="mono">
              CASE {money(deoCase?.price ?? deo.price)} · REFILL {money(deoRefill?.price ?? 22)}
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}
