"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addLine, checkoutUrl, setDiscountCode, setLineQuantity } from "@/lib/bag";

export type FormState = { ok: boolean; message: string | null; at?: number };

const refresh = () => revalidatePath("/", "layout");

export async function addToBag(_prev: FormState, formData: FormData): Promise<FormState> {
  const variantId = String(formData.get("variantId") ?? "");
  if (!variantId) return { ok: false, message: "Choose an option first.", at: Date.now() };
  try {
    await addLine(variantId, 1);
  } catch (err) {
    console.error("addToBag:", err);
    return { ok: false, message: "That could not be added. Please try again.", at: Date.now() };
  }
  refresh();
  return { ok: true, message: null, at: Date.now() };
}

export async function changeQuantity(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  const quantity = Number(formData.get("quantity"));
  if (!lineId || !Number.isFinite(quantity)) return;
  try {
    await setLineQuantity(lineId, quantity);
  } catch (err) {
    console.error("changeQuantity:", err);
  }
  refresh();
}

const CODE_PATTERN = /^[A-Z0-9-]{6,}$/;

export async function applyDossierCode(_prev: FormState, formData: FormData): Promise<FormState> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!CODE_PATTERN.test(code)) {
    return { ok: false, message: "That code does not look right. It is printed on the card inside your Dossier.", at: Date.now() };
  }
  try {
    await setDiscountCode(code);
  } catch (err) {
    console.error("applyDossierCode:", err);
    return { ok: false, message: "The code could not be saved. Please try again.", at: Date.now() };
  }
  refresh();
  return { ok: true, message: null, at: Date.now() };
}

export async function removeDossierCode() {
  try {
    await setDiscountCode(null);
  } catch (err) {
    console.error("removeDossierCode:", err);
  }
  refresh();
}

export async function goToCheckout(): Promise<FormState> {
  let url: string | null = null;
  try {
    url = await checkoutUrl();
  } catch (err) {
    console.error("goToCheckout:", err);
  }
  if (url) redirect(url);
  return {
    ok: false,
    message: "Checkout opens once the shop is connected to Shopify. This bag is a demo.",
    at: Date.now(),
  };
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "That email address does not look right.", at: Date.now() };
  }
  const hook = process.env.NEWSLETTER_WEBHOOK_URL?.trim();
  if (!hook) {
    // Nothing stores the address until NEWSLETTER_WEBHOOK_URL is set, so don't claim it was saved.
    return { ok: false, message: "The Inner Circle opens soon. Sign-ups are not being taken yet.", at: Date.now() };
  }
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "merowen-inner-circle" }),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch (err) {
    console.error("subscribe:", err);
    return { ok: false, message: "That did not go through. Please try again.", at: Date.now() };
  }
  return { ok: true, message: "Noted. You are in the Inner Circle.", at: Date.now() };
}
