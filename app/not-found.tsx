import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page" style={{ minHeight: "60vh" }}>
      <div className="wrap stack stack--28">
        <p className="mono mono--ash">00.0°N 00.0°E — --:--</p>
        <h1 className="display h1">
          Off <em>the map.</em>
        </h1>
        <p className="lead">This page doesn’t exist, or it has moved on.</p>
        <Link href="/" className="btn btn--ghost self-start">
          Return to Merowen
        </Link>
      </div>
    </div>
  );
}
