import Link from "next/link";

export default function DankePage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        <div className="text-sm uppercase tracking-[0.2em] text-white/50">
          Danke
        </div>

        <h1 className="mt-4 text-4xl font-semibold">
          Deine Anfrage wurde erfolgreich gesendet.
        </h1>

        <p className="mt-4 text-white/65">
          Wir leiten deine Anfrage an passende Anbieter weiter. Du wirst
          schnellstmöglich kontaktiert.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-2xl bg-[#6f73ff] px-6 py-4 text-base font-semibold text-white"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}