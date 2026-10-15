import Link from "next/link";
import type { Product } from "@/lib/types";
import type { RangeItem } from "@/lib/fallback";
import { libraryImage } from "@/lib/fallback";
import { scentColor, type CareProduct } from "@/lib/fieldcare";
import { shopifyImage } from "@/lib/assets";

/** "FROM $195 · 50 ML" from the first variant. */
export function fromPrice(p: Product): string | null {
  const v = p.variants[0];
  if (!v?.price) return null;
  return `From ${v.price}${v.title ? ` · ${v.title}` : ""}`;
}

export function PostingCard({
  p,
  lit = false,
  showPrice = true,
  small = false,
  onHover,
}: {
  p: Product;
  lit?: boolean;
  showPrice?: boolean;
  small?: boolean;
  onHover?: (handle: string | null) => void;
}) {
  const m = p.posting!;
  const price = showPrice ? fromPrice(p) : null;
  return (
    <Link
      href={`/products/${p.handle}`}
      className={lit ? "card is-lit" : "card"}
      onMouseEnter={onHover ? () => onHover(p.handle) : undefined}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
    >
      <div className="frame ratio-45 card__media">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.imageAlt || `${p.title} flacon`} loading="lazy" decoding="async" />
        ) : null}
      </div>
      <div className="card__text">
        <div className="card__meta">
          <span>
            {m.number} · {m.hour}
          </span>
          <span className="swatch" style={{ background: m.liquid }} aria-hidden="true" />
        </div>
        <h3 className={small ? "card__name card__name--28" : "card__name"}>{p.title}</h3>
        <p className="card__line">{m.line}</p>
        {price ? <p className="card__price">{price}</p> : null}
      </div>
    </Link>
  );
}

export function RangeCard({ r }: { r: RangeItem }) {
  const img = libraryImage(r.handle);
  return (
    <Link href={`/products/${r.handle}`} className="card">
      <div className="frame ratio-11 card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img ? <img src={img} alt={r.title} loading="lazy" decoding="async" /> : null}
        {r.preparing ? <span className="tag">In preparation</span> : null}
      </div>
      <div className="card__text">
        <p className="card__meta">
          {r.role} · {r.format}
        </p>
        <h3 className="card__name card__name--28">{r.title}</h3>
        <p className="card__line">{r.body}</p>
        <p className="card__price">{r.price}</p>
      </div>
    </Link>
  );
}

export function CareCard({ p, mini = false }: { p: CareProduct; mini?: boolean }) {
  return (
    <Link href={`/products/${p.handle}`} className={mini ? "card card--mini" : "card card--care"}>
      <div className="frame ratio-45 card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shopifyImage(p.image, 800)} alt={`${p.title}, ${p.size}`} loading="lazy" decoding="async" />
      </div>
      {mini ? (
        <>
          <p className="card__meta">{p.code}</p>
          <h3 className="card__name card__name--24">{p.title}</h3>
          <p className="card__price">
            {p.size} — {p.price}
          </p>
        </>
      ) : (
        <div className="card__text">
          <div className="card__meta">
            <span>{p.code}</span>
            <span className="scent-tag">
              {p.scent}
              <span className="swatch swatch--8" style={{ background: scentColor[p.scent] }} aria-hidden="true" />
            </span>
          </div>
          <h3 className="card__name card__name--26">{p.title}</h3>
          <p className="card__line">{p.line}</p>
          <p className="card__price">
            {p.size} — {p.price}
          </p>
        </div>
      )}
    </Link>
  );
}

/** Home teaser: image plus `FC/0n · NAME` with a scent square. */
export function CareTile({ p }: { p: CareProduct }) {
  return (
    <Link href={`/products/${p.handle}`} className="card card--mini">
      <div className="frame ratio-45 card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shopifyImage(p.image, 800)} alt={p.title} loading="lazy" decoding="async" />
      </div>
      <div className="card__caption">
        <span>
          {p.code} · {p.title}
        </span>
        <span className="swatch swatch--8" style={{ background: scentColor[p.scent] }} aria-hidden="true" />
      </div>
    </Link>
  );
}
