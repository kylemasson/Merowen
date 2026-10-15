import type { Metadata } from "next";
import Link from "next/link";
import { CareCard } from "@/components/Cards";
import { CARE, CARE_STEPS, media, type CareStep } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Field Care",
  description: "Ten everyday essentials for shave, hair, skin and body, each scented with one of the four postings.",
};

type Props = { searchParams: Promise<{ step?: string }> };

export default async function FieldCarePage({ searchParams }: Props) {
  const { step: raw } = await searchParams;
  const step = CARE_STEPS.find((s) => s.toLowerCase() === raw?.toLowerCase()) ?? null;
  const items = step ? CARE.filter((c) => c.step === step) : CARE;
  const chips: (CareStep | null)[] = [null, ...CARE_STEPS];

  return (
    <main className="page">
      <div className="wrap stack stack--lg">
        <div className="head-row">
          <div className="head-row__title">
            <div className="eyebrow">Field Care</div>
            <h1 className="h1 h1--page">
              The kit <em>behind the scent.</em>
            </h1>
          </div>
          <p className="copy head-row__aside">
            Ten everyday essentials for shave, hair, skin and body, each scented with one of the four postings so it
            layers with the fragrance.
          </p>
        </div>

        <nav className="chips" aria-label="Filter by step" id="grid">
          {chips.map((s) => (
            <Link
              key={s ?? "all"}
              href={s ? `/field-care?step=${s.toLowerCase()}#grid` : "/field-care#grid"}
              className="chip"
              aria-current={s === step ? "true" : undefined}
              scroll={false}
            >
              {s ?? "All"}
            </Link>
          ))}
        </nav>

        <div className="cards cards--care">
          {items.map((c) => (
            <CareCard key={c.handle} item={c} />
          ))}
        </div>

        <div className="split ritual">
          <div className="frame frame--169">
            <img
              src={media("merowen_care_ritual_v05.jpg")}
              alt="Lathering shave cream in a stone bowl"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="stack measure-sm">
            <div className="eyebrow">The morning shave</div>
            <h2 className="h2 h2--md">
              A close shave <em>before first light.</em>
            </h2>
            <p className="copy">Shave Cream in Azrou, Aftershave Balm in Mirbat, Aftershave Tonic in Kilda.</p>
            <Link href="/field-care?step=shave#grid" className="btn btn--ghost btn--start">
              Shop the shave
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
