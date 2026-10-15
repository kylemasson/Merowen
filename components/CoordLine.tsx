/** The signature device: place on the left, coordinates and hour on the right, a pewter hairline beneath. At most one per section. */
export function CoordLine({ left, right, type = false }: { left: string; right: string; type?: boolean }) {
  return (
    <div className={type ? "coord coord--type" : "coord"}>
      <div className="coord__row">
        <span>{left}</span>
        <span className="coord__right">{right}</span>
      </div>
      <div className="coord__rule" aria-hidden="true" />
    </div>
  );
}

export function postingLeft(number: string, name: string) {
  return `Posting ${number} — ${name}`;
}

export function postingRight(coordinates: string, hour: string) {
  return [coordinates, hour].filter(Boolean).join(" — ");
}
