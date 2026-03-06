"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnfragePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    category: "Hauswartung",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Anfrage konnte nicht gesendet werden.");
        return;
      }

      router.push("/danke");
    } catch {
      setError("Serverfehler. Bitte später nochmals versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[460px] w-[460px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[380px] w-[380px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8">
          <div className="mb-10 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#7EC8FF]" />
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
                AUFTRAGO
              </span>
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Startseite
              </Link>
              <Link
                href="/leistungen"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Leistungen
              </Link>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60 backdrop-blur">
                Kostenlose Anfrage für Reinigung, Umzug, Transport & Entsorgung
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] md:text-6xl">
                Sende jetzt deine Anfrage für{" "}
                <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                  Reinigung, Hauswartung, Umzug, Transport oder Entsorgung
                </span>
                .
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
                Mit Auftrago kannst du in wenigen Minuten eine professionelle
                Anfrage erfassen. Egal ob du eine Reinigung suchst, einen Umzug
                planst, einen Transport organisieren musst oder eine Entsorgung
                brauchst – wir helfen dir, passende Anbieter zu finden.
              </p>

              <p className="mt-4 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
                Je präziser deine Angaben sind, desto besser können passende
                Firmen deine Anfrage einschätzen und dir eine passende Offerte
                machen.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/55">
                {[
                  "Hauswartung",
                  "Reinigung",
                  "Büroreinigung",
                  "Treppenhausreinigung",
                  "Umzugsreinigung",
                  "Gartenpflege",
                  "Umzug",
                  "Transport",
                  "Entsorgung",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">1 Min</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Anfrage schnell und einfach ausfüllen.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">Gratis</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Kostenlos und unverbindlich für Kunden.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">Lokal</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Passende Anbieter aus deiner Region.
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="text-sm uppercase tracking-[0.22em] text-white/45">
                  So funktioniert es
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {[
                    {
                      step: "01",
                      title: "Anfrage erfassen",
                      text: "Du beschreibst kurz deinen Auftrag und gibst Ort sowie gewünschte Leistung an.",
                    },
                    {
                      step: "02",
                      title: "Anbieter finden",
                      text: "Passende Firmen sehen deine Anfrage und können sich dafür interessieren.",
                    },
                    {
                      step: "03",
                      title: "Offerte erhalten",
                      text: "Nach der Freischaltung wirst du von passenden Anbietern kontaktiert.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="rounded-3xl border border-white/10 bg-[#081122]/80 p-5"
                    >
                      <div className="text-sm font-medium tracking-[0.18em] text-[#9fd8ff]">
                        {item.step}
                      </div>
                      <h3 className="mt-3 text-xl font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-white/62">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-6 shadow-[0_25px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-7">
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.12),transparent_45%)]" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#c7ebff]">
                  Anfrageformular
                </div>

                <h2 className="mt-4 text-3xl font-semibold leading-tight">
                  Jetzt kostenlos Anfrage senden
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/62 md:text-base">
                  Gib deine Kontaktdaten und deinen Auftrag ein. Wir speichern
                  die Anfrage professionell im System.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                      placeholder="Max Muster"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Telefon
                      </label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                        placeholder="079 123 45 67"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        E-Mail
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                        placeholder="name@email.ch"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Stadt / Region
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, city: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                        placeholder="Zürich"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Kategorie
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none focus:border-[#7EC8FF]/50"
                      >
                        <option value="Hauswartung">Hauswartung</option>
                        <option value="Reinigung">Reinigung</option>
                        <option value="Büroreinigung">Büroreinigung</option>
                        <option value="Treppenhausreinigung">
                          Treppenhausreinigung
                        </option>
                        <option value="Umzugsreinigung">Umzugsreinigung</option>
                        <option value="Gartenpflege">Gartenpflege</option>
                        <option value="Umzug">Umzug</option>
                        <option value="Transport">Transport</option>
                        <option value="Entsorgung">Entsorgung</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Beschreibung
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                      placeholder="Zum Beispiel: Wir suchen einen Umzug von Aarau nach Zürich, inkl. Transport von Möbeln, oder eine schnelle Entsorgung von Sperrgut und alten Möbeln."
                      required
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-[22px] bg-[#7EC8FF] px-5 py-4 text-lg font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.30)] transition hover:bg-[#91d2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Wird gesendet..." : "Kostenlos Anfrage senden"}
                  </button>

                  <p className="text-center text-xs leading-6 text-white/42">
                    Kostenlos für Kunden. Unverbindlich. Schnell. Lokal.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}