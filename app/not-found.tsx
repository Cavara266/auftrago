import Link from "next/link"

export default function NotFound() {
  return (
    <main className="container-app section-space">
      <section className="card mx-auto max-w-4xl p-6 text-center sm:p-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-white/50">
          404 · Seite nicht gefunden
        </p>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Diese Seite existiert leider nicht
        </h1>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            Zur Startseite
          </Link>
          <Link href="/offerte-anfragen" className="btn btn-outline">
            Offerte anfragen
          </Link>
        </div>
      </section>
    </main>
  )
}