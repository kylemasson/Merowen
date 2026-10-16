"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hh, postingForHour } from "@/lib/catalog";

// The hero's coordinate line, set to the visitor's own hour: the posting that covers it, by the same rule
// as Find your hour, linking to that posting.
export function YourHour() {
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => setHour(new Date().getHours()), []);
  const h = hour ?? 23;
  const p = postingForHour(h);
  return (
    <Link
      href={`/products/${p.handle}`}
      className={hour === null ? "coord coord--type coord--link is-pending" : "coord coord--type coord--link"}
      aria-label={`Your hour: ${p.name}, posting ${p.num}`}
    >
      <div className="coord__row coord__row--three">
        <span className="coord__ash">YOUR HOUR · {hh(h)}</span>
        <span className="coord__bone">
          POSTING {p.num} — {p.name.toUpperCase()}
        </span>
        <span>
          {p.coords} — {hh(p.hour)}
        </span>
      </div>
      <div className="coord__rule" />
    </Link>
  );
}
