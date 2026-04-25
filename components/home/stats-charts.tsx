"use client"

import { useEffect, useState } from "react"

export default function StatsCharts() {

  const [values, setValues] = useState<number[]>([20, 35, 40, 60, 75, 90])

  useEffect(() => {

    const interval = setInterval(() => {

      setValues((prev) =>
        prev.map(() =>
          Math.floor(Math.random() * 100)
        )
      )

    }, 4000)

    return () => clearInterval(interval)

  }, [])

  return (
    <section className="mb-16">

      <h2 className="mb-6 text-2xl font-semibold text-white">
        Plattform Aktivität
      </h2>

      <div className="card p-6">

        <div className="flex items-end gap-3 h-40">

          {values.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded bg-blue-500 transition-all duration-700"
              style={{ height: `${v}%` }}
            />
          ))}

        </div>

      </div>

    </section>
  )
}