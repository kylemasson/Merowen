import type { Metadata } from "next";
import Link from "next/link";
import { BagContents } from "@/components/BagDrawer";
import { readCart } from "@/lib/cart";

export const metadata: Metadata = { title: "Your Bag", robots: { index: false } };
export const dynamic = "force-dynamic";

/** The bag as a page: the fallback when JavaScript is off, and a direct link. */
export default async function CartPage() {
  const cart = await readCart();
  const empty = !cart || cart.totalQuantity === 0;

  return (
    <div className="page">
      <div className="wrap cart-page stack stack--28">
        <p className="eyebrow">Your Bag</p>
        {empty ? (
          <>
            <h1 className="display h2">
              Nothing in the bag <em>yet.</em>
            </h1>
            <p className="small">Four vials, letterbox-sized. The price is credited toward your first flacon.</p>
            <Link href="/products/the-dossier" className="btn btn--primary self-start">
              Begin with the Dossier
            </Link>
          </>
        ) : (
          <>
            <h1 className="display h2">
              {cart.totalQuantity} {cart.totalQuantity === 1 ? "piece" : "pieces"}, <em>ready to travel.</em>
            </h1>
            <div>
              <BagContents cart={cart} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
