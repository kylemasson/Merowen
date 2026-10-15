import type { Metadata } from "next";
import Link from "next/link";
import { BagFoot, BagLines } from "@/components/BagContents";
import { getBag } from "@/lib/bag";

export const metadata: Metadata = { title: "Bag", robots: { index: false } };

// The bag as a page: what the Bag link opens when JavaScript is off.
export default async function CartPage() {
  const bag = await getBag();
  return (
    <main className="page">
      <div className="wrap bag-page stack stack--32">
        <h1 className="h1 h1--page">Bag</h1>
        {bag.count === 0 ? (
          <div className="stack">
            <p className="lede">
              Nothing in the bag <em>yet.</em> The Dossier is four vials, letterbox-sized, and its price is credited
              toward your first flacon.
            </p>
            <Link href="/products/the-dossier" className="btn btn--primary btn--start">
              See the Dossier
            </Link>
          </div>
        ) : (
          <div>
            <BagLines bag={bag} />
            <BagFoot bag={bag} />
          </div>
        )}
      </div>
    </main>
  );
}
