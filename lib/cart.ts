import "server-only";
import { cookies } from "next/headers";
import { getCart } from "./shopify";
import type { Cart } from "./types";

export const CART_COOKIE = "merowen_cart";

export async function readCartId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value;
}

export async function readCart(): Promise<Cart | null> {
  const id = await readCartId();
  return id ? getCart(id) : null;
}
