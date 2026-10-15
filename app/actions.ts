"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addCartLines,
  createCart,
  getCart,
  isShopifyConfigured,
  removeCartLine,
  updateCartLine,
  updateDiscountCodes,
} from "@/lib/shopify";
import { CART_COOKIE, readCartId as getCartId } from "@/lib/cart";

async function setCartCookie(id: string) {
  const store = await cookies();
  store.set(CART_COOKIE, id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export type ActionState = { ok: boolean; message: string } | null;

export async function addToCart(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const variantId = String(formData.get("variantId") || "");
  if (!isShopifyConfigured() || !variantId) {
    return { ok: false, message: "Checkout opens once the Shopify store is connected." };
  }
  try {
    const lines = [{ merchandiseId: variantId, quantity: 1 }];
    const cartId = await getCartId();
    const existing = cartId ? await getCart(cartId) : null;
    const cart = existing ? await addCartLines(existing.id, lines) : await createCart(lines);
    if (!existing) await setCartCookie(cart.id);
    revalidatePath("/", "layout");
    return { ok: true, message: "Added to your bag." };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "That could not be added. Please try again." };
  }
}

export async function changeQuantity(formData: FormData): Promise<void> {
  const lineId = String(formData.get("lineId") || "");
  const quantity = Number(formData.get("quantity"));
  const cartId = await getCartId();
  if (!cartId || !lineId || Number.isNaN(quantity)) return;
  if (quantity <= 0) await removeCartLine(cartId, lineId);
  else await updateCartLine(cartId, lineId, quantity);
  revalidatePath("/", "layout");
}

export async function goToCheckout(): Promise<void> {
  const cartId = await getCartId();
  const cart = cartId ? await getCart(cartId) : null;
  if (!cart || cart.totalQuantity === 0) redirect("/cart");
  redirect(cart.checkoutUrl);
}

export type CodeState = { error: string } | null;

const CODE_FORMAT_ERROR = "That code does not look right. It is printed on the card inside your Dossier.";

/** Saves a Dossier code on the Shopify cart; Shopify decides whether it applies. */
export async function applyDossierCode(_prev: CodeState, formData: FormData): Promise<CodeState> {
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,}$/.test(code)) return { error: CODE_FORMAT_ERROR };
  const cartId = await getCartId();
  if (!isShopifyConfigured() || !cartId) return { error: "Add something to the bag first, then enter the code." };
  try {
    await updateDiscountCodes(cartId, [code]);
    revalidatePath("/", "layout");
    return null;
  } catch (err) {
    console.error(err);
    return { error: "That code could not be saved. Please try again." };
  }
}

export async function removeDossierCode(): Promise<void> {
  const cartId = await getCartId();
  if (!cartId || !isShopifyConfigured()) return;
  await updateDiscountCodes(cartId, []);
  revalidatePath("/", "layout");
}

export async function subscribe(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  const hook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!hook) {
    return { ok: false, message: "Sign-up is not connected yet. Set NEWSLETTER_WEBHOOK_URL." };
  }
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "merowen-inner-circle" }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return { ok: true, message: "You’re in. We write rarely." };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "That didn’t go through. Please try again." };
  }
}
