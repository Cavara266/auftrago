import Link from "next/link"

export default function ProviderCTA() {

  return (

    <section className="card p-16 text-center mb-32">

      <h2 className="text-3xl font-bold text-white mb-6">
        Neue Aufträge für dein Unternehmen
      </h2>

      <p className="text-white/70 mb-8 max-w-xl mx-auto">
        Registriere dich als Anbieter auf Auftrago
        und erhalte neue Kundenanfragen aus deiner Region.
      </p>

      <Link href="/anbieter" className="btn btn-primary btn-large">
        Anbieter werden
      </Link>

    </section>

  )
}