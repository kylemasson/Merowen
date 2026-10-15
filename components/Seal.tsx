// The Merowen seal: a pewter ring around the M mark.
export function Seal({ size = 32, ring = "#AEB4BB", mark = "#EDEDEB" }: { size?: number; ring?: string; mark?: string }) {
  return (
    <svg className="seal" width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke={ring} />
      <path d="M8 18.5 V9.5 L14 15 L20 9.5 V18.5" stroke={mark} />
    </svg>
  );
}
