import Link from "next/link";
import type { CareItem, Posting, RangeItem } from "@/lib/catalog";
import { SIZES, hh, kindTag, money, posting as postingBy } from "@/lib/catalog";

type PostingCardProps = {
  posting: Posting;
  lit?: boolean;
  size?: "lg" | "md";
  showPrice?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
};

export function PostingCard({ posting: p, lit, size = "lg", showPrice = true, onEnter, onLeave }: PostingCardProps) {
  return (
    <Link
      href={`/products/${p.handle}`}
      className={lit ? "card is-lit" : "card"}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <div className="frame frame--45">
        <img src={p.image} alt={`${p.name} flacon`} loading="lazy" decoding="async" />
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span>
            {p.num} · {hh(p.hour)} · {kindTag(p)}
          </span>
          <span className="swatch" style={{ background: p.liquid }} aria-hidden="true" />
        </div>
        <div className={size === "lg" ? "card__name" : "card__name card__name--28"}>{p.name}</div>
        <div className="card__line">{p.line}</div>
        {showPrice && <div className="card__price">FROM {money(SIZES[0].price)} · 50 ML</div>}
      </div>
    </Link>
  );
}

export function RangeCard({ item, tag }: { item: RangeItem; tag: "role" | "format" }) {
  return (
    <Link href={`/products/${item.handle}`} className="card">
      <div className="frame frame--11">
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
        {item.preparing && <span className="badge">In preparation</span>}
      </div>
      <div className="card__body">
        <div className="card__meta">{tag === "role" ? `${item.role} · ${item.format}` : item.format}</div>
        <div className="card__name card__name--28">{item.name}</div>
        <div className="card__line">{tag === "role" ? item.desc : item.line}</div>
        <div className="card__price">{money(item.price)}</div>
      </div>
    </Link>
  );
}

export function CareCard({ item, compact = false }: { item: CareItem; compact?: boolean }) {
  const scent = postingBy(item.scent)!;
  return (
    <Link href={`/products/${item.handle}`} className="card card--care">
      <div className="frame frame--45">
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
        {item.preparing && <span className="badge">In preparation</span>}
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span>{item.code}</span>
          {!compact && (
            <span className="scent">
              {scent.name.toUpperCase()}
              <span className="swatch swatch--8" style={{ background: scent.liquid }} aria-hidden="true" />
            </span>
          )}
        </div>
        <div className={compact ? "card__name card__name--24" : "card__name card__name--26"}>{item.name}</div>
        {!compact && <div className="card__line">{item.line}</div>}
        <div className="card__price">
          {item.size.toUpperCase()} — {money(item.formats?.[0].price ?? item.price)}
        </div>
      </div>
    </Link>
  );
}

/** The home teaser: image with a one-line caption, `FC/0n · NAME` and a scent swatch. */
export function CareTeaserCard({ item }: { item: CareItem }) {
  const scent = postingBy(item.scent)!;
  return (
    <Link href={`/products/${item.handle}`} className="card card--teaser">
      <div className="frame frame--45">
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
      </div>
      <div className="card__meta card__meta--stone">
        <span>
          {item.code} · {item.name}
        </span>
        <span className="swatch swatch--8" style={{ background: scent.liquid }} aria-hidden="true" />
      </div>
    </Link>
  );
}
