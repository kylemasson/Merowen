import type { Metadata } from "next";
import { FieldCareCatalog } from "@/components/FieldCareCatalog";

export const metadata: Metadata = {
  title: "Field Care",
  description:
    "Ten everyday essentials for shave, hair, skin and body, each scented with one of the four Merowen postings so it layers with the fragrance.",
};

export default function FieldCarePage() {
  return (
    <div className="page">
      <div className="wrap flow">
        <div className="head">
          <div className="stack">
            <p className="eyebrow">Field Care</p>
            <h1 className="display h1">
              The kit <em>behind the scent.</em>
            </h1>
          </div>
          <p className="body" style={{ maxWidth: 400 }}>
            Ten everyday essentials for shave, hair, skin and body, each scented with one of the four postings so it layers
            with the fragrance.
          </p>
        </div>
        <FieldCareCatalog />
      </div>
    </div>
  );
}
