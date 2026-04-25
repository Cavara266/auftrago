"use client"

import { useState } from "react"

export default function AnbieterRegisterPage() {

  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    const form = new FormData(e.currentTarget)

    setLoading(true)

    await fetch("/api/providers", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        city: form.get("city"),
        description: form.get("description")
      })
    })

    alert("Registrierung erfolgreich!")

    setLoading(false)
  }

  return (
    <main className="container-app section-space">

      <h1 className="text-4xl font-bold text-white mb-8">
        Anbieter registrieren
      </h1>

      <form
        onSubmit={submit}
        className="glass-card p-8 max-w-xl space-y-4"
      >

        <input
          name="name"
          placeholder="Firmenname"
          required
          className="input"
        />

        <input
          name="city"
          placeholder="Stadt"
          required
          className="input"
        />

        <textarea
          name="description"
          placeholder="Beschreibung"
          className="input h-32"
        />

        <button
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Registriere..." : "Jetzt registrieren"}
        </button>

      </form>

    </main>
  )
}