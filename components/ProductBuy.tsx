"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addToBag, type FormState } from "@/app/actions";
import { money } from "@/lib/catalog";
import type { OfferOption } from "@/lib/offers";
import { useBag } from "./BagContext";
import { useNarrow } from "./useMotion";

type Props = {
  name: string;
  optionLabel: string | null;
  options: OfferOption[];
  preparing: boolean;
  note: string | null;
  /** The buy bar's sub-line for each option, e.g. "EDP · 50 ML". */
  barSubs: string[];
  more?: { label: string; href: string };
};

const idle: FormState = { ok: false, message: null };

// Options, the Add button and, on phones, the sticky buy bar that appears once the buy block scrolls away.
export function ProductBuy({ name, optionLabel, options, preparing, note, barSubs, more }: Props) {
  const { setBagOpen, bagOpen, menuOpen, say } = useBag();
  const [selected, setSelected] = useState(0);
  const [state, action] = useActionState(addToBag, idle);
  const [notified, setNotified] = useState(false);
  const [buyVisible, setBuyVisible] = useState(true);
  const buyRef = useRef<HTMLDivElement>(null);
  const narrow = useNarrow();
  const option = options[selected] ?? options[0];
  const canBuy = !preparing && Boolean(option?.available && option.variantId);
  const price = option ? money(option.price, option.currency) : "";

  // Adding opens the drawer; a failure shows a toast.
  const seen = useRef(state.at);
  useEffect(() => {
    if (state.at === seen.current) return;
    seen.current = state.at;
    if (state.ok) setBagOpen(true);
    else if (state.message) say(state.message);
  }, [state, setBagOpen, say]);

  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setBuyVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showBar = narrow && canBuy && !buyVisible && !bagOpen && !menuOpen;

  useEffect(() => {
    document.body.classList.toggle("has-buybar", showBar);
    return () => document.body.classList.remove("has-buybar");
  }, [showBar]);

  return (
    <>
      <form id="buy-form" action={action} className="stack stack--32">
        {optionLabel && options.length > 1 && (
          <fieldset className="options">
            <legend className="eyebrow">{optionLabel}</legend>
            {options.map((o, i) => (
              <label key={`${o.label}-${i}`} className="option">
                <input
                  type="radio"
                  name="variantId"
                  value={o.variantId ?? ""}
                  checked={i === selected}
                  onChange={() => setSelected(i)}
                />
                <span className="option__label">{o.label}</span>
                <span className="option__sub">{o.sub ?? money(o.price, o.currency)}</span>
              </label>
            ))}
          </fieldset>
        )}
        {!(optionLabel && options.length > 1) && option?.variantId && (
          <input type="hidden" name="variantId" value={option.variantId} />
        )}

        <div ref={buyRef} className="buy">
          {preparing ? (
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={() => {
                setNotified(true);
                say("Noted. Sign up to the Inner Circle below and we will write when it is ready.");
              }}
            >
              {notified ? "We will write when it is ready" : "Notify me"}
            </button>
          ) : canBuy ? (
            <AddButton price={price} />
          ) : (
            <button type="button" className="btn btn--ghost btn--block" disabled>
              Not available yet
            </button>
          )}
          {note && <p className="note">{note}</p>}
          {more && (
            <Link href={more.href} className="text-link">
              {more.label}
            </Link>
          )}
        </div>
      </form>

      {showBar && (
        <>
          <div className="buybar-spacer" aria-hidden="true" />
          <div className="buybar">
            <div className="buybar__text">
              <span className="buybar__name">{name}</span>
              <span className="buybar__sub">{barSubs[selected] ?? ""}</span>
            </div>
            <button type="submit" form="buy-form" className="btn btn--primary">
              Add — <span className="btn__price">{price}</span>
            </button>
          </div>
        </>
      )}
    </>
  );
}

function AddButton({ price }: { price: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--primary btn--block" disabled={pending}>
      {pending ? "Adding" : "Add to bag"} — <span className="btn__price">{price}</span>
    </button>
  );
}
