"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addToCart, type ActionState } from "@/app/actions";
import { openBag, toast } from "@/lib/ui";

export type BuyOption = {
  label: string;
  sub?: string | null;
  /** Shopify variant id; null on demo data, where the bag explains checkout isn't open yet. */
  variantId: string | null;
  available: boolean;
  price: string | null;
  barSub: string;
};

function AddButton({ label, price, className, form }: { label: string; price: string | null; className: string; form?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} form={form}>
      {pending ? "Adding…" : label}
      {!pending && price ? <span className="price-inline">— {price}</span> : null}
    </button>
  );
}

/**
 * Option buttons, Add to bag, the note under it, and the sticky buy bar that
 * appears on narrow screens once the main buy block scrolls out of view.
 */
export function ProductBuy({
  name,
  options,
  optionLabel = "Size",
  note,
  more,
  preparing = false,
}: {
  name: string;
  options: BuyOption[];
  optionLabel?: string;
  note?: string;
  more?: { href: string; label: string };
  preparing?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const option = options[Math.min(index, options.length - 1)];
  const [state, action] = useActionState<ActionState, FormData>(addToCart, null);
  const formId = useId();
  const buyRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  // Adding opens the bag; anything else (demo mode, errors) shows a short note.
  useEffect(() => {
    if (!state) return;
    if (state.ok) openBag();
    else toast(state.message);
  }, [state]);

  useEffect(() => {
    const el = buyRef.current;
    if (!el || preparing || !("IntersectionObserver" in window)) return;
    const narrow = window.matchMedia("(max-width: 759px)");
    let out = false;
    const update = () => setShowBar(narrow.matches && out);
    const io = new IntersectionObserver(([e]) => {
      out = !e.isIntersecting;
      update();
    });
    io.observe(el);
    narrow.addEventListener("change", update);
    return () => {
      io.disconnect();
      narrow.removeEventListener("change", update);
    };
  }, [preparing]);

  useEffect(() => {
    const root = document.documentElement;
    if (showBar) root.dataset.buybar = "on";
    else delete root.dataset.buybar;
    return () => {
      delete root.dataset.buybar;
    };
  }, [showBar]);

  const soldOut = Boolean(option?.variantId) && !option?.available;

  return (
    <>
      {options.length > 1 ? (
        <div className="options">
          <p className="options__label" id={`${formId}-label`}>
            {optionLabel}
          </p>
          <div className="options__grid" role="group" aria-labelledby={`${formId}-label`}>
            {options.map((o, i) => (
              <button key={o.label + i} type="button" className="option" aria-pressed={i === index} onClick={() => setIndex(i)}>
                <span className="option__label">{o.label}</span>
                {o.sub ? <span className="option__sub">{o.sub}</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div ref={buyRef} className="buy">
        {preparing ? (
          <a href="#inner-circle" className="btn btn--ghost btn--block">
            Notify me
          </a>
        ) : (
          <form id={formId} action={action}>
            <input type="hidden" name="variantId" value={option?.variantId ?? ""} />
            {soldOut ? (
              <button type="button" className="btn btn--primary btn--block" disabled>
                Sold out
              </button>
            ) : (
              <AddButton label="Add to bag" price={option?.price ?? null} className="btn btn--primary btn--block" />
            )}
          </form>
        )}
        {note ? <p className="buy__note">{note}</p> : null}
        {more ? (
          <Link href={more.href} className="text-link">
            {more.label}
          </Link>
        ) : null}
      </div>

      {showBar && !soldOut ? (
        <>
          <div className="buybar-spacer" />
          <div className="buybar">
            <div className="buybar__text">
              <span className="buybar__name">{name}</span>
              <span className="buybar__sub">{option?.barSub}</span>
            </div>
            <button type="submit" form={formId} className="btn btn--primary">
              Add{option?.price ? <span className="price-inline">— {option.price}</span> : null}
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
