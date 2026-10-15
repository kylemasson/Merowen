"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { PostingCard } from "./Cards";

const hourOf = (p: Product) => parseInt(p.posting?.hour ?? "0", 10) || 0;
const TICKS = [0, 6, 12, 18, 24];

/**
 * The 24-hour rail, the "Find your hour" slider and the posting cards.
 * The slider starts at the visitor's local hour and lights the latest posting
 * at or before it (wrapping round to the last one). Hovering a card overrides it.
 */
export function FindYourHour({ postings }: { postings: Product[] }) {
  const byHour = [...postings].sort((a, b) => hourOf(a) - hourOf(b));
  const [hour, setHour] = useState(20);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => setHour(new Date().getHours()), []);

  const h = hour % 24;
  const pick = byHour.filter((p) => hourOf(p) <= h).pop() ?? byHour[byHour.length - 1];
  const lit = hover ?? pick?.handle;
  const hourText = `${String(h).padStart(2, "0")}:00`;

  return (
    <>
      <div className="hours">
        <div className="rail" aria-hidden="true">
          <div className="rail__line" />
          <div className="rail__marker" style={{ left: `${(hour / 24) * 100}%` }} />
          {TICKS.map((t) => (
            <div
              key={t}
              className="rail__tick"
              style={{ left: `${(t / 24) * 100}%`, transform: `translateX(${t === 0 ? "0" : t === 24 ? "-100%" : "-50%"})` }}
            >
              {String(t).padStart(2, "0")}
            </div>
          ))}
          {byHour.map((p) => (
            <div
              key={p.handle}
              className={lit === p.handle ? "rail__stop is-lit" : "rail__stop"}
              style={{ left: `${(hourOf(p) / 24) * 100}%` }}
            >
              <span className="rail__long">
                {p.posting?.hour} {p.title.toUpperCase()}
              </span>
              <span className="rail__short">{p.posting?.hour.slice(0, 2)}</span>
            </div>
          ))}
        </div>
        <input
          type="range"
          className="hours__range"
          min={0}
          max={24}
          step={1}
          value={hour}
          onChange={(e) => {
            setHour(Number(e.target.value));
            setHover(null);
          }}
          aria-label="Find your hour"
          aria-valuetext={hourText}
        />
        <div className="hours__foot">
          <div className="hours__now">
            <span className="eyebrow">Find your hour</span>
            <span className="hours__time">{hourText}</span>
          </div>
          {pick ? (
            <Link href={`/products/${pick.handle}`} className="hours__pick">
              <span className="mono mono--ash">POSTING {pick.posting?.number}</span>
              <span className="hours__name">{pick.title.toUpperCase()}</span>
              <em className="hours__line">{pick.posting?.line}</em>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="cards">
        {byHour.map((p) => (
          <PostingCard key={p.handle} p={p} lit={lit === p.handle} onHover={setHover} />
        ))}
      </div>
    </>
  );
}
