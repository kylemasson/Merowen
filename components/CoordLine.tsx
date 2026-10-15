import type { Posting } from "@/lib/catalog";
import { hh } from "@/lib/catalog";

// The signature device: posting and name on the left, coordinates and hour on the right, a pewter rule below.
// Use at most one per section.
export function CoordLine({ posting, animate = false }: { posting: Posting; animate?: boolean }) {
  return (
    <div className={animate ? "coord coord--type" : "coord"}>
      <div className="coord__row">
        <span>
          POSTING {posting.num} — {posting.name.toUpperCase()}
        </span>
        <span>
          {posting.coords} — {hh(posting.hour)}
        </span>
      </div>
      <div className="coord__rule" />
    </div>
  );
}
