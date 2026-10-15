/** Drawn Merowen flacon: chamfered glass fading to matte black at the base, knurled steel cap with M seal, bone ink lettering, tinted with the posting's liquid colour. Used until real photography exists. */
export function Bottle({
  liquid,
  label,
  title,
  className = "posting__bottle",
}: {
  liquid: string;
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 400 520" role="img" aria-label={title} className={className}>
      <circle cx="200" cy="200" r="150" fill="none" stroke="#AEB4BB" strokeWidth="0.6" opacity="0.25" />
      <ellipse cx="200" cy="482" rx="150" ry="14" fill="none" stroke="#AEB4BB" strokeWidth="0.8" opacity="0.5" />
      <defs>
        <linearGradient id="mw-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.52" stopColor="#0B0B0C" stopOpacity="0" />
          <stop offset="0.78" stopColor="#0B0B0C" stopOpacity="0.92" />
          <stop offset="1" stopColor="#0B0B0C" stopOpacity="1" />
        </linearGradient>
      </defs>
      <polygon points="118,190 282,190 292,204 292,466 282,480 118,480 108,466 108,204" fill="#121313" stroke="#55565A" strokeWidth="1.4" />
      <polygon points="126,256 274,256 282,266 282,460 274,470 126,470 118,460 118,266" fill={liquid} opacity="0.9" style={{ transition: "fill .6s" }} />
      <polygon points="118,190 282,190 292,204 292,466 282,480 118,480 108,466 108,204" fill="url(#mw-fade)" />
      <path d="M118 190 L108 204 V466 L118 480 M282 190 L292 204 V466 L282 480" fill="none" stroke="#CFD3D8" strokeWidth="0.8" opacity="0.55" />
      <rect x="128" y="200" width="7" height="268" rx="3" fill="#EDEDEB" opacity="0.08" />
      <rect x="170" y="162" width="60" height="30" fill="#2A2C24" stroke="#55554A" strokeWidth="1" />
      <rect x="154" y="78" width="92" height="86" rx="3" fill="#2B2D2C" stroke="#4A4C49" strokeWidth="0.8" />
      <ellipse cx="200" cy="80" rx="46" ry="6" fill="#34363A" stroke="#4A4C49" strokeWidth="0.8" />
      <circle cx="200" cy="80" r="9" fill="none" stroke="#AEB4BB" strokeWidth="0.7" opacity="0.8" />
      <text x="200" y="83" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="9" fill="#AEB4BB" opacity="0.9">M</text>
      <path d="M164 90 V152 M176 90 V152 M188 90 V152 M200 90 V152 M212 90 V152 M224 90 V152 M236 90 V152" stroke="#1A1B1A" strokeWidth="1.1" />
      <rect x="164" y="180" width="72" height="9" fill="#2B2D2C" />
      <text x="204" y="318" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="25" letterSpacing="8" fill="#EDEDEB">
        MEROWEN
      </text>
      <path d="M182 334 H218" stroke="#EDEDEB" strokeWidth="0.5" opacity="0.6" />
      <text x="202" y="354" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" letterSpacing="4.5" fill="#EDEDEB" opacity="0.85">
        {title.replace(/ flacon$/i, "").toUpperCase()}
      </text>
      <text x="200" y="452" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" letterSpacing="1.6" fill="#EDEDEB" opacity="0.55">
        {label}
      </text>
      <path d="M126 460 H274" stroke="#EDEDEB" strokeWidth="0.7" opacity="0.45" />
    </svg>
  );
}
