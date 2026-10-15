"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Cart } from "@/lib/types";
import { OPEN_BAG } from "@/lib/ui";
import { BagDrawer } from "./BagDrawer";
import { CoordLine } from "./CoordLine";
import { Seal } from "./Seal";
import { useDialog } from "./useDialog";

const LEFT = [
  { label: "The Postings", href: "/range" },
  { label: "The Dossier", href: "/products/the-dossier" },
  { label: "Field Care", href: "/field-care" },
];

const MENU = [...LEFT, { label: "About", href: "/about" }, { label: "Home", href: "/" }];

export function Header({ cart }: { cart: Cart | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const menuRef = useDialog<HTMLDivElement>(menuOpen, () => setMenuOpen(false));
  const count = cart?.totalQuantity ?? 0;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const open = () => {
      setMenuOpen(false);
      setBagOpen(true);
    };
    window.addEventListener(OPEN_BAG, open);
    return () => window.removeEventListener(OPEN_BAG, open);
  }, []);

  // Changing route closes the menu and the bag.
  useEffect(() => {
    setMenuOpen(false);
    setBagOpen(false);
  }, [pathname]);

  const clear = pathname === "/" && !scrolled;
  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <>
      <header className={clear ? "site-header site-header--clear" : "site-header"}>
        <div className="site-header__inner">
          <nav className="nav" aria-label="Primary">
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
            <div className="nav__desktop">
              {LEFT.map((l) => (
                <Link key={l.href} href={l.href} aria-current={current(l.href)}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <Link href="/" className="brand" aria-label="Merowen home">
            <Seal size={28} />
            <span className="brand__dot" aria-hidden="true">
              ·
            </span>
            <span className="brand__word">MEROWEN</span>
          </Link>

          <div className="nav nav--end">
            <div className="nav__desktop">
              <Link href="/about" aria-current={current("/about")}>
                About
              </Link>
            </div>
            {/* Without JavaScript this is a plain link to the /cart page. */}
            <a
              href="/cart"
              className="bag-btn"
              aria-haspopup="dialog"
              onClick={(e) => {
                e.preventDefault();
                setBagOpen(true);
              }}
            >
              Bag <span className="bag-btn__count">{String(count).padStart(2, "0")}</span>
            </a>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div ref={menuRef} className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu__top">
            <span className="brand__word">MEROWEN</span>
            <button type="button" className="close-btn" onClick={() => setMenuOpen(false)}>
              Close
            </button>
          </div>
          <nav className="menu__nav" aria-label="Menu">
            {MENU.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="menu__foot">
            <CoordLine left="Posting 04 — Kilda" right="57.8°N 8.6°W — 20:00" />
          </div>
        </div>
      ) : null}

      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} cart={cart} />
    </>
  );
}
