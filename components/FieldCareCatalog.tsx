"use client";

import { useState } from "react";
import { careLine, careSteps, type CareStep } from "@/lib/fieldcare";
import { assets, shopifyImage } from "@/lib/assets";
import { CareCard } from "./Cards";

type Filter = "All" | CareStep;

/** Step chips, the product grid and the morning-shave block. Without JS every product shows. */
export function FieldCareCatalog() {
  const [step, setStep] = useState<Filter>("All");
  const items = careLine.filter((p) => step === "All" || p.step === step);

  return (
    <>
      <div className="chips" role="group" aria-label="Filter by step">
        {(["All", ...careSteps] as Filter[]).map((s) => (
          <button key={s} type="button" className="chip" aria-pressed={step === s} onClick={() => setStep(s)}>
            {s}
          </button>
        ))}
      </div>
      <div className="cards cards--240" aria-live="polite">
        {items.map((p) => (
          <CareCard key={p.handle} p={p} />
        ))}
      </div>
      <div className="split" style={{ marginTop: "clamp(32px, 5vw, 64px)" }}>
        <div className="frame ratio-169">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shopifyImage(assets.ritual, 1400)} alt="Lathering shave cream in a stone bowl" loading="lazy" decoding="async" />
        </div>
        <div className="stack" style={{ maxWidth: 440 }}>
          <p className="eyebrow">The morning shave</p>
          <h2 className="display h2--xs">
            A close shave <em>before first light.</em>
          </h2>
          <p className="body">Shave Cream in Azrou, Aftershave Balm in Mirbat, Aftershave Tonic in Kilda.</p>
          <button
            type="button"
            className="btn btn--ghost self-start"
            onClick={() => {
              setStep("Shave");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Shop the shave
          </button>
        </div>
      </div>
    </>
  );
}
