"use client";

import { useState } from "react";
import { useMotionAllowed, useNarrow } from "./useMotion";

type Props = { still: string; stillMobile: string; film?: string | null; alt: string };

// Hero still with a slow zoom, or a muted film when one is supplied. Phones always get the portrait still
// (the 9:16 film is not regenerated for v05 yet). Pause freezes the zoom where it is; a failed film falls back
// to the still, never a black frame.
export function HeroMedia({ still, stillMobile, film, alt }: Props) {
  const motion = useMotionAllowed();
  const narrow = useNarrow();
  const [paused, setPaused] = useState(false);
  const [filmFailed, setFilmFailed] = useState(false);
  const showFilm = Boolean(film) && motion && !narrow && !filmFailed && !paused;

  const cls = ["hero__media", motion ? "is-moving" : "", paused ? "is-paused" : ""].join(" ");

  return (
    <>
      <div className={cls}>
        {showFilm ? (
          <video
            src={film!}
            poster={still}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onError={() => setFilmFailed(true)}
          />
        ) : (
          <picture>
            <source media="(max-width: 759px)" srcSet={stillMobile} />
            <img src={still} alt={alt} fetchPriority="high" decoding="async" />
          </picture>
        )}
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      {(motion || paused) && (
        <div className="hero__controls">
          <button
            type="button"
            className="ctl"
            aria-label={paused ? "Play motion" : "Pause motion"}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      )}
    </>
  );
}
