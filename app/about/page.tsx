import type { Metadata } from "next";
import { media } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About",
  description: "Merowen is composed in Park City, Utah. Every bottle is a posting: one place we stand, one hour, one material.",
};

const PACKAGING = [
  {
    k: "Flacon",
    v: "Extra-clear flint glass with chamfered edges, the lower third in opaque matte black, on a solid base. Tall blackened-steel cap in satin gunmetal, knurled like a dive-watch crown, over a slim steel neck collar engraved with posting, hour, batch and date.",
  },
  {
    k: "Outer box",
    v: "Uncoated black FSC board, blind-debossed seal, coordinate line printed in bone ink, magnetic close. No foil, no plastic insert.",
  },
  { k: "Field Care", v: "Obsidian glass or black aluminium, blackened-steel caps and pumps, refillable steel deodorant case." },
  { k: "Rule", v: "No gold or brass hardware, no paper labels, no foil." },
];

const PILLARS = [
  { k: "Purpose", v: "Two mountains, two streets: the places we stand, bottled for people who move through the world with composure." },
  { k: "Promise", v: "Each fragrance names one place, one hour and one material. The mountain postings are made from their place; the city postings are composed for theirs. We say which." },
  { k: "Proof", v: "Natural-origin index on every label, named material origins, batch-dated flacons, a lifetime refill." },
  { k: "Personality", v: "Discreet. Well-travelled. Exacting. Quietly wry." },
];

export default function AboutPage() {
  return (
    <main>
      <section className="page page--hero">
        <div className="wrap split">
          <div className="stack stack--28">
            <div className="eyebrow">The House</div>
            <h1 className="h1 h1--page">
              From the pass. From the river. <em>From the stone.</em>
            </h1>
            <p className="lede measure-sm">
              Every Merowen bottle is a posting: one place we stand, one hour of the day, one material carried home from
              it. Each is composed in Park City, Utah.
            </p>
          </div>
          <div className="frame frame--45">
            <img src={media("merowen_master_blackfriars_v08.jpg")} alt="Blackfriars flacon with frankincense" decoding="async" />
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap split split--end">
          <div className="stack">
            <div className="eyebrow">The name</div>
            <div className="stack stack--tight">
              <div className="name-mark">MEROWEN</div>
              <div className="mono mono--pewter">MERR-OH-WEN</div>
            </div>
          </div>
          <p className="copy name-story">
            We read the name as two halves: <em>mer</em>, the sea, and Owen, the old Welsh name long read as noble or
            well-born. The elemental, refined.
          </p>
        </div>
      </section>

      <section className="section" id="packaging" aria-labelledby="packaging-title">
        <div className="wrap split">
          <div className="frame frame--11">
            <img src={media("merowen_box_blackfriars_v08.jpg")} alt="The Blackfriars flacon in its presentation box" loading="lazy" decoding="async" />
          </div>
          <div className="stack stack--28">
            <div className="eyebrow">Packaging</div>
            <h2 className="h2 h2--sm" id="packaging-title">
              Made <em>to be kept.</em>
            </h2>
            <dl className="specs">
              {PACKAGING.map((row) => (
                <div className="spec spec--prov" key={row.k}>
                  <dt className="spec__k">{row.k}</dt>
                  <dd className="spec__v">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section section--flush-top" id="contact">
        <div className="wrap">
          {PILLARS.map((p) => (
            <div className="pillar" key={p.k}>
              <div className="eyebrow">{p.k}</div>
              <div className="pillar__v">{p.v}</div>
            </div>
          ))}
          <div className="pillar">
            <div className="eyebrow">Contact</div>
            <div className="pillar__v">[Contact email TBC] · Park City, Utah</div>
          </div>
        </div>
      </section>
    </main>
  );
}
