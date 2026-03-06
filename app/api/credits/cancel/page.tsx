// app/credits/cancel/page.tsx
import Link from "next/link";

export default function CreditsCancel() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Zahlung abgebrochen</h1>
        <p className="mt-2 text-sm text-white/60">
          Kein Problem — du kannst jederzeit erneut Credits kaufen.
        </p>

        <div className="mt-6 flex gap-2">
          <Link className="btn btn-primary" href="/credits">
            Zurück zu Credits
          </Link>
          <Link className="btn" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}