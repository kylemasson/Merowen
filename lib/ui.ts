"use client";

/** Small window events so any component can open the bag or show a toast without shared state. */
export const OPEN_BAG = "merowen:open-bag";
export const TOAST = "merowen:toast";

export function openBag() {
  window.dispatchEvent(new Event(OPEN_BAG));
}

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST, { detail: message }));
}
