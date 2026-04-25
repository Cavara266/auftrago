export default function PlatformStats() {
  const stats = [
    { label: "Anfragen pro Monat", value: "1'500+" },
    { label: "Dienstleister", value: "800+" },
    { label: "Städte", value: "120+" },
    { label: "Ø Antwortzeit", value: "24h" },
  ]

  return (
    <section className="mb-32">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {stats.map((stat) => (
          <div key={stat.label} className="card p-6 text-center">

            <div className="text-3xl font-bold text-white mb-2">
              {stat.value}
            </div>

            <div className="text-sm text-white/60">
              {stat.label}
            </div>

          </div>
        ))}

      </div>

    </section>
  )
}