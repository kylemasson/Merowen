import Link from "next/link";
import { FooterSignup } from "./InnerCircle";

const COLS = [
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
      ["Your Bag", "/cart"],
      ["Contact", "mailto:[CONTACT EMAIL]"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <span className="site-footer__word">MEROWEN</span>
            <p className="small">Composed in the wild. Worn in the dark.</p>
            <p className="mono mono--ash" style={{ fontSize: 11, lineHeight: 1.6, letterSpacing: "0.1em" }}>
              PARK CITY, UTAH · EST. 2026
            </p>
            <FooterSignup />
          </div>
          {COLS.map((col) => (
            <nav key={col.title} className="site-footer__col" aria-label={col.title}>
              <p className="eyebrow">{col.title}</p>
              {col.links.map(([label, href]) =>
                href.startsWith("/") ? (
                  <Link key={label} href={href}>
                    {label}
                  </Link>
                ) : (
                  <a key={label} href={href}>
                    {label}
                  </a>
                ),
              )}
            </nav>
          ))}
        </div>
        <div className="site-footer__legal">
          <span>© {new Date().getFullYear()} MEROWEN — PARK CITY, UTAH · 40.6461° N, 111.4980° W</span>
          <span>CHECKOUT BY SHOPIFY</span>
        </div>
      </div>
    </footer>
  );
}
