"use client";

import { useState } from "react";
import { useMotionAllowed } from "./useMotion";

type Props = { name: string; images: string[]; film?: string | null; ratio: "45" | "11" };

// Product media: the film (muted, looped, with Pause) when there is one and motion is allowed,
// otherwise the image gallery. A failed film falls back to the still.
export function ProductMedia({ name, images, film, ratio }: Props) {
  const motion = useMotionAllowed();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const canFilm = Boolean(film) && motion && !failed && index === 0;
  const main = images[index];

  return (
    <div className="pdp__media">
      <div className={`frame frame--${ratio}`}>
        {canFilm && !paused ? (
          <video src={film!} poster={main} autoPlay muted loop playsInline aria-hidden="true" onError={() => setFailed(true)} />
        ) : main ? (
          <img src={main} alt={name} decoding="async" fetchPriority="high" />
        ) : (
          <div className="frame__empty">image to come</div>
        )}
        {canFilm && (
          <button
            type="button"
            className="ctl media-ctl"
            aria-label={paused ? "Play motion" : "Pause motion"}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "Play" : "Pause"}
          </button>
        )}
      </div>
      {images.length > 1 && (
        <div className="pdp__thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className="thumb"
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <img src={src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
