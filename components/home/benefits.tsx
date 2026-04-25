export default function Benefits() {

  const items = [
    {
      title: "Mehrere Offerten",
      text: "Vergleiche Angebote von lokalen Dienstleistern und finde den besten Preis."
    },
    {
      title: "Geprüfte Anbieter",
      text: "Alle Anbieter auf Auftrago werden vor der Freischaltung geprüft."
    },
    {
      title: "Schnelle Antworten",
      text: "Viele Anfragen erhalten innerhalb von 24 Stunden eine erste Offerte."
    }
  ]

  return (

    <section className="mb-32">

      <h2 className="text-3xl font-semibold text-white mb-10">
        Warum Auftrago?
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {items.map((item) => (
          <div key={item.title} className="card p-8">

            <h3 className="text-xl text-white mb-3">
              {item.title}
            </h3>

            <p className="text-white/70 text-sm">
              {item.text}
            </p>

          </div>
        ))}

      </div>

    </section>

  )
}