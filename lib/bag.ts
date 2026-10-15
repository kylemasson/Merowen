import "server-only";

import { cookies } from "next/headers";
import { DOSSIER, POSTINGS, careItem, posting, rangeItem } from "./catalog";
import type { Bag, BagLine } from "./bag-types";
import { EMPTY_BAG } from "./bag-types";
import { demoOptions } from "./offers";
import {
  addCartLine,
  createCart,
  fetchCart,
  shopifyConfigured,
  updateCartLine,
  updateDiscountCodes,
  type ShopifyCart,
} from "./shopify";

// The bag. With a Shopify token it is a Storefront cart (ID in the `merowen_cart` cookie).
// Without one it is a demo bag kept in the `merowen_demo_bag` cookie, priced from the catalogue.

const CART_COOKIE = "merowen_cart";
const DEMO_COOKIE = "merowen_demo_bag";
const COOKIE_OPTS = { httpOnly: true, sameSite: "lax" as const, secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 };

type DemoState = { lines: [string, number][]; code: string | null };

const isPostingHandle = (handle: string) => POSTINGS.some((p) => p.handle === handle);
const sum = (xs: { discountedAmount: { amount: string } }[]) =>
  xs.reduce((n, x) => n + Number(x.discountedAmount.amount), 0);

// ---------- demo bag ----------

function parseDemoId(id: string) {
  const [prefix, handle, index] = id.split(":");
  if (prefix !== "demo" || !handle) return null;
  const opts = demoOptions(handle);
  const option = opts?.options[Number(index)];
  if (!option || rangeItem(handle)?.preparing) return null;
  return { handle, option };
}

async function readDemo(): Promise<DemoState> {
  const raw = (await cookies()).get(DEMO_COOKIE)?.value;
  if (!raw) return { lines: [], code: null };
  try {
    const parsed = JSON.parse(raw) as DemoState;
    const lines = Array.isArray(parsed.lines)
      ? parsed.lines.filter(
          (l): l is [string, number] =>
            Array.isArray(l) && typeof l[0] === "string" && Number.isInteger(l[1]) && l[1] > 0 && !!parseDemoId(l[0]),
        )
      : [];
    return { lines: lines.slice(0, 30), code: typeof parsed.code === "string" ? parsed.code : null };
  } catch {
    return { lines: [], code: null };
  }
}

async function writeDemo(state: DemoState) {
  (await cookies()).set(DEMO_COOKIE, JSON.stringify(state), COOKIE_OPTS);
}

function demoBag(state: DemoState): Bag {
  const lines: BagLine[] = state.lines.flatMap(([id, quantity]) => {
    const parsed = parseDemoId(id);
    if (!parsed) return [];
    const { handle, option } = parsed;
    const p = posting(handle);
    const r = rangeItem(handle);
    const c = careItem(handle);
    const name = p?.name ?? r?.name ?? c?.name ?? handle;
    const image = p?.image ?? r?.image ?? c?.image ?? null;
    const variant = p
      ? `EDP · ${option.label}`
      : r
        ? r.byPosting
          ? `${r.format} · ${option.label}`
          : r.format
        : `${c?.code} · ${option.label}`;
    return [{ id, handle, name, variant: variant.toUpperCase(), quantity, total: option.price * quantity, image }];
  });
  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const applicable = lines.some((l) => isPostingHandle(l.handle));
  const credit = state.code && applicable ? Math.min(DOSSIER.price, subtotal) : 0;
  return {
    live: false,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    lines,
    currency: "USD",
    subtotal,
    credit,
    total: subtotal - credit,
    code: state.code ? { code: state.code, applicable } : null,
    hasDossier: lines.some((l) => l.handle === DOSSIER.handle),
  };
}

// ---------- Shopify bag ----------

function shopifyBag(cart: ShopifyCart): Bag {
  const lines: BagLine[] = cart.lines.nodes.map((l) => ({
    id: l.id,
    handle: l.merchandise.product.handle,
    name: l.merchandise.product.title,
    variant: l.merchandise.title === "Default Title" ? "" : l.merchandise.title.toUpperCase(),
    quantity: l.quantity,
    total: Number(l.cost.totalAmount.amount),
    image: l.merchandise.image?.url ?? null,
  }));
  const subtotal = Number(cart.cost.subtotalAmount.amount);
  const credit = sum(cart.discountAllocations) + cart.lines.nodes.reduce((n, l) => n + sum(l.discountAllocations), 0);
  const code = cart.discountCodes[0] ?? null;
  return {
    live: true,
    count: cart.totalQuantity,
    lines,
    currency: cart.cost.subtotalAmount.currencyCode,
    subtotal,
    credit,
    total: subtotal - credit,
    code,
    hasDossier: lines.some((l) => l.handle === DOSSIER.handle),
  };
}

async function cartId() {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}

async function saveCartId(id: string) {
  (await cookies()).set(CART_COOKIE, id, COOKIE_OPTS);
}

// ---------- public API ----------

export async function getBag(): Promise<Bag> {
  if (!shopifyConfigured()) return demoBag(await readDemo());
  const id = await cartId();
  if (!id) return { ...EMPTY_BAG, live: true };
  try {
    const cart = await fetchCart(id);
    return cart ? shopifyBag(cart) : { ...EMPTY_BAG, live: true };
  } catch (err) {
    console.error("Shopify cart:", err);
    return { ...EMPTY_BAG, live: true };
  }
}

export async function addLine(variantId: string, quantity = 1) {
  if (!shopifyConfigured()) {
    if (!parseDemoId(variantId)) throw new Error("Unknown item");
    const state = await readDemo();
    const existing = state.lines.find(([id]) => id === variantId);
    if (existing) existing[1] = Math.min(existing[1] + quantity, 99);
    else state.lines.push([variantId, quantity]);
    await writeDemo(state);
    return;
  }
  if (variantId.startsWith("demo:")) throw new Error("Unknown item");
  const id = await cartId();
  const cart = id
    ? await addCartLine(id, variantId, quantity).catch(() => createCart(variantId, quantity))
    : await createCart(variantId, quantity);
  await saveCartId(cart.id);
}

export async function setLineQuantity(lineId: string, quantity: number) {
  const qty = Math.max(0, Math.min(99, Math.floor(quantity)));
  if (!shopifyConfigured()) {
    const state = await readDemo();
    state.lines = state.lines
      .map(([id, q]): [string, number] => [id, id === lineId ? qty : q])
      .filter(([, q]) => q > 0);
    await writeDemo(state);
    return;
  }
  const id = await cartId();
  if (id) await updateCartLine(id, lineId, qty);
}

export async function setDiscountCode(code: string | null) {
  if (!shopifyConfigured()) {
    const state = await readDemo();
    state.code = code;
    await writeDemo(state);
    return;
  }
  const id = await cartId();
  if (id) await updateDiscountCodes(id, code ? [code] : []);
}

export async function checkoutUrl(): Promise<string | null> {
  if (!shopifyConfigured()) return null;
  const id = await cartId();
  if (!id) return null;
  const cart = await fetchCart(id);
  return cart && cart.totalQuantity > 0 ? cart.checkoutUrl : null;
}
