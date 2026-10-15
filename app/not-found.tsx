import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div className="wrap stack stack--28">
        <div className="eyebrow">404</div>
        <h1 className="h1 h1--page">
          Off the map. <em>No posting here.</em>
        </h1>
        <Link href="/range" className="btn btn--ghost btn--start">
          The Postings
        </Link>
      </div>
    </main>
  );
}
