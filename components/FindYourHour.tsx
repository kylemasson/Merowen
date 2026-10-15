"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { POSTINGS_BY_HOUR, hh, postingForHour } from "@/lib/catalog";
import { PostingCard } from "./Cards";

const TICKS = [0, 6, 12, 18, 24];
const pct = (hour: number) => `${((hour / 24) * 100).toFixed(2)}%`;

// The 24-hour rail. The slider starts at the visitor's local hour; the posting that covers that hour is lit,
// and hovering a card overrides it.
export function FindYourHour() {
  const [hour, setHour] = useState(20);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => setHour(new Date().getHours()), []);

  const pick = postingForHour(hour);
  const lit = hover ?? pick.handle;

  return (
    <>
      <div className="hours">
        <div className="rail" aria-hidden="true">
          <div className="rail__line" />
          <div className="rail__marker" style={{ left: pct(hour) }} />
          {TICKS.map((t) => (
            <div
              key={t}
              className="rail__tick"
              style={{ left: pct(t), transform: `translateX(${t === 0 ? "0" : t === 24 ? "-100%" : "-50%"})` }}
            >
              {String(t).padStart(2, "0")}
            </div>
          ))}
          {POSTINGS_BY_HOUR.map((p) => (
            <Link
              key={p.handle}
              href={`/products/${p.handle}`}
              tabIndex={-1}
              className={lit === p.handle ? "rail__stop is-lit" : "rail__stop"}
              style={{ left: pct(p.hour) }}
              onMouseEnter={() => setHover(p.handle)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="rail__stop-label rail__stop-label--long">
                {hh(p.hour)} {p.name.toUpperCase()}
              </span>
              <span className="rail__stop-label rail__stop-label--short">{String(p.hour).padStart(2, "0")}</span>
              <span className="rail__stop-dot" />
            </Link>
          ))}
        </div>
        <input
          className="hour-input"
          type="range"
          min={0}
          max={24}
          step={1}
          value={hour}
          onChange={(e) => {
            setHour(Number(e.target.value));
            setHover(null);
          }}
          aria-label="Find your hour"
          aria-valuetext={hh(hour % 24)}
        />
        <div className="hour-pick">
          <div className="hour-pick__now">
            <span className="eyebrow">Find your hour</span>
            <span className="hour-pick__time">{hh(hour % 24)}</span>
          </div>
          <Link href={`/products/${pick.handle}`} className="hour-pick__link" aria-live="polite">
            <span className="mono mono--ash">POSTING {pick.num}</span>
            <span className="hour-pick__name">{pick.name}</span>
            <em className="hour-pick__line">{pick.line}</em>
          </Link>
        </div>
      </div>
      <div className="cards">
        {POSTINGS_BY_HOUR.map((p) => (
          <PostingCard
            key={p.handle}
            posting={p}
            lit={lit === p.handle}
            onEnter={() => setHover(p.handle)}
            onLeave={() => setHover(null)}
          />
        ))}
      </div>
    </>
  );
}
