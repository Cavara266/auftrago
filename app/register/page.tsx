"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    companyName: "",
    phone: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: form.companyName,
          phone: form.phone,
          city: form.city,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registrierung fehlgeschlagen.");
        return;
      }

      router.push("/login");
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
                href="/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60 backdrop-blur">
                Anbieter Registrierung
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] md:text-6xl">
                Registriere deine Firma auf{" "}
                <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                  Auftrago
                </span>
                .
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
                Erstelle jetzt dein Anbieter-Konto und erhalte Zugriff auf neue
                Anfragen für Reinigung, Hauswartung, Umzug, Transport und
                Entsorgung.
              </p>

              <p className="mt-4 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
                Nach der Registrierung kannst du dich einloggen, Credits kaufen
                und passende Leads direkt freischalten.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/55">
                {[
                  "Leads freischalten",
                  "Credits nutzen",
                  "Lokale Anfragen",
                  "Neue Aufträge",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-6 shadow-[0_25px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-7">
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.12),transparent_45%)]" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#c7ebff]">
                  Registrierung
                </div>

                <h2 className="mt-4 text-3xl font-semibold leading-tight">
                  Anbieter-Konto erstellen
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/62 md:text-base">
                  Registriere dich mit deinen Firmendaten, E-Mail und Passwort.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Firmenname
                    </label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                      placeholder="Muster Reinigung GmbH"
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
                          setForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                        placeholder="079 123 45 67"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Stadt
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                        placeholder="Zürich"
                        required
                      />
                    </div>
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
                      placeholder="firma@email.ch"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Passwort
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                      placeholder="Mindestens 6 Zeichen"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Passwort bestätigen
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                      placeholder="Passwort wiederholen"
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
                    {loading ? "Wird erstellt..." : "Konto erstellen"}
                  </button>

                  <p className="text-center text-sm text-white/55">
                    Bereits registriert?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-[#9fd8ff] hover:text-[#bfe7ff]"
                    >
                      Zum Login
                    </Link>
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