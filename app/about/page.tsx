import type { Metadata } from "next";
import { assets, shopifyImage } from "@/lib/assets";

export const metadata: Metadata = {
  title: "About",
  description: "Merowen is composed in Park City, Utah. Every bottle is a posting: one wild place, one hour, one material.",
};

const PACKAGING = [
  [
    "Flacon",
    "Extra-clear flint glass with chamfered edges, the lower third fading from matte black into clear. A tall blackened-steel cap in satin gunmetal, knurled like a dive-watch crown, over a slim steel neck collar engraved with posting, hour, batch and date.",
  ],
  ["Outer box", "Uncoated black FSC board, blind-debossed seal, coordinate line printed in bone ink, magnetic close. No foil, no plastic insert."],
  ["Field Care", "Obsidian glass or black aluminium, blackened-steel caps and pumps, refillable steel deodorant case."],
  ["Rule", "No gold or brass hardware, no paper labels, no foil."],
];

const PILLARS = [
  ["Purpose", "Bring the world’s wild places to people who move through it with composure."],
  ["Promise", "Each fragrance names one place, one hour and one hero material, and can be traced to them."],
  ["Proof", "Natural-origin index on every label, named sourcing regions, batch-dated flacons, a lifetime refill."],
  ["Personality", "Discreet. Well-travelled. Exacting. Quietly wry."],
];

export default function AboutPage() {
  return (
    <>
      <section className="page" style={{ paddingBottom: "clamp(64px, 8vw, 112px)" }}>
        <div className="wrap split">
          <div className="stack stack--28">
            <p className="eyebrow">The House</p>
            <h1 className="display h1">
              From the sea. From the stone. <em>From the root.</em>
            </h1>
            <p className="lead" style={{ maxWidth: 480 }}>
              Every Merowen bottle is a posting: one wild place, one hour of the day, one material carried home from it.
              Composed in Park City, Utah.
            </p>
          </div>
          <div className="frame ratio-45">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shopifyImage(assets.master, 1400)} alt="The Mirbat flacon with frankincense" />
          </div>
        </div>
      </section>

      <section className="section section--alt" style={{ paddingBlock: "clamp(64px, 9vw, 128px)" }} aria-labelledby="name-title">
        <div className="wrap split split--end" style={{ alignItems: "start" }}>
          <div className="stack">
            <h2 id="name-title" className="eyebrow">
              The name
            </h2>
            <div className="stack" style={{ gap: 12 }}>
              <p className="name-word">MEROWEN</p>
              <p className="name-say">MERR-OH-WEN</p>
            </div>
          </div>
          <p className="name-copy">
            We read the name as two halves: <em>mer</em>, the sea, and Owen, the old Welsh name long read as noble or
            well-born. The elemental, refined.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingBlock: "clamp(72px, 10vw, 144px)" }} aria-labelledby="pack-title">
        <div className="wrap split">
          <div className="frame ratio-11">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shopifyImage(assets.box, 1400)} alt="The presentation box" loading="lazy" decoding="async" />
          </div>
          <div className="stack stack--28">
            <p className="eyebrow">Packaging</p>
            <h2 id="pack-title" className="display h2--sm">
              Made <em>to be kept.</em>
            </h2>
            <dl className="rows">
              {PACKAGING.map(([k, v]) => (
                <div key={k} className="row" style={{ gridTemplateColumns: "minmax(96px, 130px) minmax(0, 1fr)" }}>
                  <dt className="row__k">{k}</dt>
                  <dd className="row__v row__v--soft">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: "clamp(72px, 10vw, 144px)" }} aria-label="Pillars">
        <dl className="wrap">
          {PILLARS.map(([k, v]) => (
            <div key={k} className="pillar">
              <dt className="eyebrow">{k}</dt>
              <dd className="pillar__v">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
