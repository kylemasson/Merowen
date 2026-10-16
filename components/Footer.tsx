import Link from "next/link";
import { FooterInnerCircle } from "./InnerCircleForm";
import { ParkCityTime } from "./ParkCityTime";
import { HOUSE_COORDS } from "@/lib/catalog";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      ["The Postings", "/range"],
      ["The Dossier", "/products/the-dossier"],
      ["The Refill", "/products/the-refill"],
      ["Field Care", "/field-care"],
    ],
  },
  {
    title: "House",
    links: [
      ["About", "/about"],
      ["The Refill Programme", "/refill-programme"],
      ["Shipping", "/about#packaging"],
      ["Contact", "/about#contact"],
    ],
  },
];

export function Footer({ version }: { version: string }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__word">MEROWEN</div>
            <p className="small">Composed in the mountains. Worn in the city.</p>
            <div className="stack stack--tight">
              <div className="mono mono--ash">PARK CITY, UTAH · {HOUSE_COORDS} · EST. 2026</div>
              <div className="mono mono--ash">
                LOCAL TIME <ParkCityTime /> MT
              </div>
            </div>
            <FooterInnerCircle />
          </div>
          {COLUMNS.map((col) => (
            <div className="footer__col" key={col.title}>
              <div className="eyebrow">{col.title}</div>
              {col.links.map(([label, href]) => (
                <Link key={label} href={href} className="footer__link">
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer__legal">
          <span>© 2026 MEROWEN — PARK CITY, UTAH · 40.6461° N, 111.4980° W</span>
          <span>CHECKOUT BY SHOPIFY · SITE {version.toUpperCase()}</span>
        </div>
      </div>
    </footer>
  );
}
