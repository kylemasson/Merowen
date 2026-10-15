"use client";

import Link from "next/link";
import { useActionState } from "react";
import { applyDossierCode, changeQuantity, goToCheckout, removeDossierCode, type CodeState } from "@/app/actions";
import type { Cart } from "@/lib/types";
import { useDialog } from "./useDialog";

export const DOSSIER_HANDLE = "the-dossier";
const POSTING_HANDLES = ["mirbat", "azrou", "torbeck", "kilda"];

export function BagDrawer({ open, onClose, cart }: { open: boolean; onClose: () => void; cart: Cart | null }) {
  const ref = useDialog<HTMLElement>(open, onClose);
  if (!open) return null;
  const count = cart?.totalQuantity ?? 0;

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <aside ref={ref} className="drawer" role="dialog" aria-modal="true" aria-label="Bag">
        <div className="drawer__top">
          <div className="drawer__title">
            Bag <span className="bag-btn__count">{String(count).padStart(2, "0")}</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
        {cart && count > 0 ? <BagContents cart={cart} /> : <EmptyBag onClose={onClose} />}
      </aside>
    </>
  );
}

function EmptyBag({ onClose }: { onClose: () => void }) {
  return (
    <div className="drawer__empty">
      <p className="display">
        Nothing in the bag <em>yet.</em>
      </p>
      <p className="small">Four vials, letterbox-sized. The price is credited toward your first flacon.</p>
      <Link href={`/products/${DOSSIER_HANDLE}`} className="btn btn--primary" onClick={onClose}>
        Begin with the Dossier
      </Link>
    </div>
  );
}

/** Lines, Dossier code, subtotal and checkout. Shared by the drawer and the /cart page. */
export function BagContents({ cart }: { cart: Cart }) {
  const hasDossier = cart.lines.some((l) => l.handle === DOSSIER_HANDLE);
  return (
    <>
      <div className="drawer__lines">
        <ul>
          {cart.lines.map((line) => (
            <li key={line.id} className="line">
              <div className="line__thumb">
                {line.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.image} alt="" loading="lazy" decoding="async" />
                ) : null}
              </div>
              <div className="line__info">
                <Link href={`/products/${line.handle}`} className="line__name">
                  {line.title}
                </Link>
                {line.variantTitle ? <span className="line__variant">{line.variantTitle}</span> : null}
                <div className="qty">
                  <form action={changeQuantity}>
                    <input type="hidden" name="lineId" value={line.id} />
                    <input type="hidden" name="quantity" value={line.quantity - 1} />
                    <button type="submit" aria-label={`One fewer ${line.title}`}>
                      −
                    </button>
                  </form>
                  <span className="qty__n" aria-label={`Quantity ${line.quantity}`}>
                    {line.quantity}
                  </span>
                  <form action={changeQuantity}>
                    <input type="hidden" name="lineId" value={line.id} />
                    <input type="hidden" name="quantity" value={line.quantity + 1} />
                    <button type="submit" aria-label={`One more ${line.title}`}>
                      +
                    </button>
                  </form>
                </div>
              </div>
              <div className="line__end">
                <span>{line.total}</span>
                <form action={changeQuantity}>
                  <input type="hidden" name="lineId" value={line.id} />
                  <input type="hidden" name="quantity" value={0} />
                  <button type="submit" className="remove-btn" aria-label={`Remove ${line.title}`}>
                    Remove
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
        {hasDossier ? (
          <p className="note-box">
            Your Dossier arrives with a single-use code worth <span className="mono">$38</span> toward a 50 or 100 ml
            Posting.
          </p>
        ) : null}
      </div>
      <div className="drawer__foot">
        <DossierCode cart={cart} />
        <div className="sum-row">
          <span className="sum-row__label">Subtotal</span>
          <span className="sum-row__value">{cart.total || cart.subtotal}</span>
        </div>
        <form action={goToCheckout}>
          <button type="submit" className="btn btn--primary btn--block">
            Checkout
          </button>
        </form>
        <p className="fine">Shipping and tax are calculated at checkout. Payment is taken by Shopify.</p>
      </div>
    </>
  );
}

function DossierCode({ cart }: { cart: Cart }) {
  const [state, action, pending] = useActionState<CodeState, FormData>(applyDossierCode, null);
  const saved = cart.discountCodes[0];
  const hasPosting = cart.lines.some((l) => POSTING_HANDLES.includes(l.handle));

  if (saved) {
    const waiting = !saved.applicable;
    return (
      <>
        <div className="credit">
          <div className="stack" style={{ gap: 6, minWidth: 0 }}>
            <span className="sum-row__label">Dossier credit</span>
            <form action={removeDossierCode} className="credit__code">
              <span>{saved.code} ·</span>
              <button type="submit">REMOVE</button>
            </form>
          </div>
          <span className={cart.credit ? "credit__value" : "credit__value credit__value--off"}>
            {cart.credit ? `−${cart.credit}` : "$0"}
          </span>
        </div>
        {waiting ? (
          <p className="form-note">
            {hasPosting
              ? "That code does not apply to this bag. Check the card inside your Dossier."
              : "Saved. The credit applies once a 50 or 100 ml Posting is in the bag."}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <>
      <form action={action} className="line-form line-form--sm line-form--code">
        <label htmlFor="dossier-code" className="visually-hidden">
          Dossier code
        </label>
        <input id="dossier-code" name="code" autoComplete="off" placeholder="Dossier code" />
        <button type="submit" disabled={pending}>
          {pending ? "Applying" : "Apply"}
        </button>
      </form>
      <p className="form-note" role="status" aria-live="polite">
        {state?.error ?? ""}
      </p>
    </>
  );
}
