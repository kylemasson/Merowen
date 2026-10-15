"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeMedia } from "@/lib/types";

function useMedia(query: string) {
  const [match, setMatch] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatch(mq.matches);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/**
 * Hero background. Plays the Shopify film for the screen size when there is
 * one; otherwise the still slowly zooms. Pausing freezes the film or the zoom
 * where it is. Reduced motion gets the still only. A film that fails to load
 * falls back to the still, never a black frame.
 */
export function HeroFilm({ media, stills }: { media: HomeMedia; stills: { desktop: string; mobile: string; alt: string } }) {
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const narrow = useMedia("(max-width: 759px)");
  const [paused, setPaused] = useState(false);
  const [frozen, setFrozen] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Phones only get a film made for 9:16; otherwise they keep the portrait still.
  const film = narrow === null ? null : narrow ? media.mobile : media.desktop;
  const motionAllowed = reduced === false;
  const playing = Boolean(film?.sources.length) && motionAllowed && !failed;

  useEffect(() => {
    if (!motionAllowed) return;
    const t = setTimeout(() => setMoving(true), 80);
    return () => clearTimeout(t);
  }, [motionAllowed]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => {});
  }, [paused, playing]);

  function toggleMotion() {
    if (paused) {
      setFrozen(null);
      setPaused(false);
      audioRef.current && soundOn && audioRef.current.play().catch(() => {});
      return;
    }
    const t = stillRef.current ? getComputedStyle(stillRef.current).transform : null;
    setFrozen(t && t !== "none" ? t : "scale(1)");
    setPaused(true);
    audioRef.current?.pause();
  }

  function toggleSound() {
    const a = audioRef.current;
    if (!a) return;
    if (soundOn) {
      a.pause();
      setSoundOn(false);
      return;
    }
    a.play()
      .then(() => setSoundOn(true))
      .catch(() => {});
  }

  const stillClass = ["hero__still", moving && !paused ? "is-moving" : "", frozen ? "is-frozen" : ""].filter(Boolean).join(" ");

  return (
    <>
      <div className="hero__media">
        {playing ? (
          <video
            key={film!.sources[0].url}
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={film!.poster ?? media.poster ?? undefined}
            aria-hidden="true"
            onError={() => setFailed(true)}
          >
            {film!.sources.map((s) => (
              <source key={s.url} src={s.url} type={s.mimeType} onError={() => setFailed(true)} />
            ))}
          </video>
        ) : (
          <picture>
            <source media="(max-width: 759px)" srcSet={stills.mobile} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={stillRef}
              src={stills.desktop}
              alt={stills.alt}
              className={stillClass}
              style={frozen ? { transform: frozen } : undefined}
              fetchPriority="high"
            />
          </picture>
        )}
        <div className="hero__shade" />
      </div>

      {media.audio ? <audio ref={audioRef} src={media.audio} loop preload="none" /> : null}

      <div className="hero__controls">
        {motionAllowed ? (
          <button type="button" className="chip-btn" onClick={toggleMotion} aria-label={paused ? "Play motion" : "Pause motion"}>
            {paused ? "Play" : "Pause"}
          </button>
        ) : null}
        {media.audio ? (
          <button type="button" className="chip-btn" onClick={toggleSound} aria-pressed={soundOn}>
            {soundOn ? "Sound off" : "Sound on"}
          </button>
        ) : null}
      </div>
    </>
  );
}
