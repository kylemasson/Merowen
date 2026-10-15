"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addToBag, applyDossierCode, changeQuantity, goToCheckout, removeDossierCode, type FormState } from "@/app/actions";
import type { Bag } from "@/lib/bag-types";
import { DOSSIER, money } from "@/lib/catalog";

const idle: FormState = { ok: false, message: null };

// The bag's lines, Dossier code and checkout. Used inside the drawer and on /cart (the no-JS fallback).
export function BagLines({ bag }: { bag: Bag }) {
  return (
    <>
      {bag.lines.map((line) => (
        <div className="line" key={line.id}>
          <div className="line__img">{line.image && <img src={line.image} alt="" loading="lazy" decoding="async" />}</div>
          <div className="line__body">
            <div className="line__name">{line.name}</div>
            {line.variant && <div className="line__variant">{line.variant}</div>}
            <div className="stepper">
              <form action={changeQuantity}>
                <input type="hidden" name="lineId" value={line.id} />
                <input type="hidden" name="quantity" value={line.quantity - 1} />
                <button className="stepper__btn" aria-label={`One fewer ${line.name}`}>
                  −
                </button>
              </form>
              <span className="stepper__qty" aria-label={`Quantity ${line.quantity}`}>
                {line.quantity}
              </span>
              <form action={changeQuantity}>
                <input type="hidden" name="lineId" value={line.id} />
                <input type="hidden" name="quantity" value={line.quantity + 1} />
                <button className="stepper__btn" aria-label={`One more ${line.name}`}>
                  +
                </button>
              </form>
            </div>
          </div>
          <div className="line__end">
            <span>{money(line.total, bag.currency)}</span>
            <form action={changeQuantity}>
              <input type="hidden" name="lineId" value={line.id} />
              <input type="hidden" name="quantity" value={0} />
              <button className="link-btn" aria-label={`Remove ${line.name}`}>
                Remove
              </button>
            </form>
          </div>
        </div>
      ))}
      {bag.hasDossier && (
        <div className="callout">
          Your Dossier arrives with a single-use code worth <span className="mono-inline">{money(DOSSIER.price)}</span> toward a 50
          or 100 ml Posting.
        </div>
      )}
    </>
  );
}

export function BagFoot({ bag, onMessage }: { bag: Bag; onMessage?: (m: string) => void }) {
  const [codeState, codeAction] = useActionState(applyDossierCode, idle);
  const [checkoutState, checkoutAction] = useActionState(goToCheckout, idle);

  useEffect(() => {
    if (checkoutState.message) onMessage?.(checkoutState.message);
  }, [checkoutState, onMessage]);

  const notApplicable = bag.code && !bag.code.applicable;

  return (
    <div className="drawer__foot">
      {bag.code ? (
        <div className="credit">
          <div className="credit__label">
            <span className="total-row__label">Dossier credit</span>
            <span className="credit__code">
              {bag.code.code} ·
              <form action={removeDossierCode}>
                <button className="link-btn">REMOVE</button>
              </form>
            </span>
          </div>
          <span className={bag.credit ? "credit__amount credit__amount--on" : "credit__amount"}>
            {bag.credit ? `−${money(bag.credit, bag.currency)}` : money(0, bag.currency)}
          </span>
        </div>
      ) : (
        <form action={codeAction} className="line-form line-form--code">
          <input name="code" autoComplete="off" placeholder="Dossier code" aria-label="Dossier code" spellCheck={false} />
          <button type="submit">Apply</button>
        </form>
      )}
      {!bag.code && codeState.message && (
        <p className="form-msg" role="status">
          {codeState.message}
        </p>
      )}
      {notApplicable && <p className="form-msg">Saved. The credit applies once a 50 or 100 ml Posting is in the bag.</p>}
      <div className="total-row">
        <span className="total-row__label">Subtotal</span>
        <span className="total-row__value">{money(bag.total, bag.currency)}</span>
      </div>
      <form action={checkoutAction}>
        <CheckoutButton />
      </form>
      {!onMessage && checkoutState.message && (
        <p className="form-msg" role="status">
          {checkoutState.message}
        </p>
      )}
      <p className="form-msg note">Shipping and tax are calculated at checkout. Payment is taken by Shopify.</p>
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn--primary btn--block" disabled={pending}>
      {pending ? "Opening checkout" : "Checkout"}
    </button>
  );
}

export function AddDossier({ variantId, label }: { variantId: string | null; label: string }) {
  const [, action] = useActionState(addToBag, idle);
  if (!variantId) return null;
  return (
    <form action={action}>
      <input type="hidden" name="variantId" value={variantId} />
      <button className="btn btn--primary">{label}</button>
    </form>
  );
}
