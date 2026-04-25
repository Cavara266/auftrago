import AppShell from "@/components/app-shell";

export default function LeadDetailLoading() {
  return (
    <AppShell>
      <main className="section">
        <div className="container">
          <span className="eyebrow">Lädt</span>
          <h1>Anfrage wird geladen.</h1>
        </div>
      </main>
    </AppShell>
  );
}