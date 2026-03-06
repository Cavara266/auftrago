export default function Preise() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Credits & Preise</h1>
      <p className="mt-3 text-white/70 leading-relaxed">
        Du kannst dich gratis bewerben – bezahlt wird erst, wenn du die Kontaktdaten freischaltest.
        Typisch sind 1–50 Credits (entspricht ca. CHF 3–150), je nach Auftragsgrösse/Kategorie.{" "}
        <span className="text-white/50">(Referenz: Ofri Modell)</span>
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { t: "Pay-per-Contact", d: "Du zahlst nur für freigeschaltete Kontakte." },
          { t: "Credits", d: "Jeder Lead hat einen Credit-Preis (z.B. 5–12)." },
          { t: "Aufladen", d: "Credits per Stripe kaufen – sofort verfügbar." },
        ].map((x) => (
          <div key={x.t} className="rounded-3xl border border-white/12 bg-white/7 p-6 shadow-soft">
            <div className="font-bold">{x.t}</div>
            <div className="mt-2 text-white/70">{x.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-white/12 bg-white/7 p-6 shadow-soft">
        <div className="font-bold">Nächste Schritte</div>
        <ol className="mt-3 list-decimal pl-5 text-white/75 space-y-1">
          <li>Auth (Login) für Auftragnehmer & Auftraggeber</li>
          <li>Stripe Webhook → Credits gutschreiben</li>
          <li>Admin/CRM: Leads prüfen, Kategorien, Preislogik 1–50 Credits</li>
          <li>Lead-Verkauf an Endkunden: Rechnungen/Abos + Anbieterprofile</li>
        </ol>
      </div>
    </main>
  );
}