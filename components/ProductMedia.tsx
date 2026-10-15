"use client";

import { useEffect, useRef, useState } from "react";
import type { Film } from "@/lib/types";

/**
 * Product media frame. A posting film plays muted and looped (with a Pause
 * control) when one is set in Shopify, motion is allowed and the visitor
 * hasn't paused it; otherwise the image gallery shows. A film that fails falls
 * back to the still.
 */
export function ProductMedia({
  images,
  alt,
  ratio = "45",
  film,
  fallback,
}: {
  images: string[];
  alt: string;
  ratio?: "45" | "11";
  film?: Film | null;
  fallback?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const showFilm = Boolean(film?.sources.length) && !reduced && !failed && !paused && index === 0;
  const canFilm = Boolean(film?.sources.length) && !reduced && !failed && index === 0;
  const src = images[index];

  return (
    <div className="product__media">
      <div className={`frame ratio-${ratio}`}>
        {showFilm ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={film!.poster ?? images[0]}
            aria-hidden="true"
            onError={() => setFailed(true)}
          >
            {film!.sources.map((s) => (
              <source key={s.url} src={s.url} type={s.mimeType} onError={() => setFailed(true)} />
            ))}
          </video>
        ) : src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} fetchPriority={index === 0 ? "high" : undefined} />
        ) : (
          fallback ?? <div className="placeholder">image to come</div>
        )}
        {canFilm ? (
          <button type="button" className="chip-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play motion" : "Pause motion"}>
            {paused ? "Play" : "Pause"}
          </button>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="thumbs">
          {images.map((im, i) => (
            <button key={im + i} type="button" className="thumb" aria-pressed={i === index} aria-label={`View image ${i + 1}`} onClick={() => setIndex(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
