"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBag } from "./BagContext";
import { Seal } from "./Seal";
import { useDialog } from "./useDialog";
import { CoordLine } from "./CoordLine";
import { posting } from "@/lib/catalog";

const NAV = [
  { label: "The Postings", href: "/range" },
  { label: "The Dossier", href: "/products/the-dossier" },
  { label: "Field Care", href: "/field-care" },
];

const MENU = [...NAV, { label: "About", href: "/about" }, { label: "Home", href: "/" }];

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function Header() {
  const pathname = usePathname();
  const { bag, setBagOpen, menuOpen, setMenuOpen } = useBag();
  const [scrolled, setScrolled] = useState(false);
  const home = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <>
      <header className={home && !scrolled ? "site-header site-header--clear" : "site-header"}>
        <div className="site-header__bar">
          <nav className="nav nav--start" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="nav__link" aria-current={current(n.href)}>
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </button>
          <Link href="/" className="lockup" aria-label="Merowen home">
            <Seal size={32} />
            <span className="lockup__dot" aria-hidden="true">
              ·
            </span>
            <span className="lockup__word" aria-hidden="true">
              MEROWEN
            </span>
          </Link>
          <div className="nav nav--end">
            <Link href="/about" className="nav__link nav__link--wide" aria-current={current("/about")}>
              About
            </Link>
            <a
              href="/cart"
              className="bag-btn"
              aria-haspopup="dialog"
              onClick={(e) => {
                e.preventDefault();
                setBagOpen(true);
              }}
            >
              Bag <span className="bag-btn__count">{pad2(bag.count)}</span>
              <span className="sr-only"> items</span>
            </a>
          </div>
        </div>
      </header>
      {menuOpen && <Menu onClose={() => setMenuOpen(false)} />}
    </>
  );
}

function Menu({ onClose }: { onClose: () => void }) {
  const ref = useDialog<HTMLDivElement>(true, onClose);
  const kilda = posting("kilda")!;
  return (
    <div ref={ref} className="menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="panel-head">
        <span className="lockup__word">MEROWEN</span>
        <button type="button" className="panel-close" onClick={onClose}>
          Close
        </button>
      </div>
      <nav className="menu__nav" aria-label="Menu">
        {MENU.map((n) => (
          <Link key={n.href} href={n.href} className="menu__link" onClick={onClose}>
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="menu__foot">
        <CoordLine posting={kilda} />
      </div>
    </div>
  );
}
