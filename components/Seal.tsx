/** The Merowen M seal. Ring in Pewter, M in Bone (or currentColor). */
export function Seal({ size = 34, ring = "#AEB4BB", mark = "#EDEDEB", weight = 0.9 }: {
  size?: number;
  ring?: string;
  mark?: string;
  weight?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <circle cx="17" cy="17" r="16" stroke={ring} strokeWidth={weight * 0.9} />
      <path d="M9 23V11l8 9 8-9v12" stroke={mark} strokeWidth={weight} />
    </svg>
  );
}
