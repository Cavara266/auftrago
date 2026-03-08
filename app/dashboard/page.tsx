import { redirect } from "next/navigation";
import AppShell from "@/app/components/app-shell";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const unlocks = await prisma.unlock.findMany({
    where: { userId: user.id },
    include: { lead: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalUnlocked = await prisma.unlock.count({
    where: { userId: user.id },
  });

  const totalTransactions = await prisma.transaction.count({
    where: { userId: user.id },
  });

  const spentCredits = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return (
    <AppShell active="dashboard" credits={user.credits}>
      <div>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
          Willkommen in deinem Anbieterbereich. Hier bekommst du einen klaren
          Überblick über Credits, Transaktionen, freigeschaltete Leads und deine
          bisherigen Aktivitäten auf Auftrago.
        </p>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/45 sm:text-base sm:leading-7">
          Das Dashboard ist dein zentraler Arbeitsbereich: Du prüfst deinen
          Credit-Stand, siehst vergangene Freischaltungen und behältst jederzeit
          im Blick, wie aktiv du bereits mit der Plattform arbeitest.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">
            Verfügbare Credits
          </div>
          <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {user.credits}
          </div>
          <div className="mt-1 text-sm text-white/55">
            Aktuell direkt für Leads nutzbar
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">
            Freigeschaltete Leads
          </div>
          <div className="mt-2 text-2xl font-semibold text-emerald-200 sm:text-3xl">
            {totalUnlocked}
          </div>
          <div className="mt-1 text-sm text-white/55">
            Bereits genutzte Kontakte
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">
            Transaktionen
          </div>
          <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {totalTransactions}
          </div>
          <div className="mt-1 text-sm text-white/55">
            Käufe, Gutschriften und Freischaltungen
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">
            Verbrauchte Credits
          </div>
          <div className="mt-2 text-2xl font-semibold text-amber-200 sm:text-3xl">
            {spentCredits}
          </div>
          <div className="mt-1 text-sm text-white/55">
            Insgesamt für Leads eingesetzt
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-[#081122]/85 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          So nutzt du dein Dashboard optimal
        </h2>

        <div className="mt-4 space-y-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
          <p>
            Behalte deinen Credit-Stand im Blick und prüfe regelmässig neue
            Leads. Je schneller du interessante Kontakte freischaltest, desto
            besser sind oft die Chancen, früh mit dem Kunden in Kontakt zu
            kommen.
          </p>
          <p>
            Über deine Transaktionen siehst du nachvollziehbar, wann Credits
            gekauft oder eingesetzt wurden. Über die Freischaltungen erkennst du
            sofort, welche Kontakte dir bereits offenstehen und welche Leads du
            schon aktiv bearbeitet hast.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">
                Letzte Transaktionen
              </div>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Hier siehst du deine letzten Bewegungen rund um Credits,
                Freischaltungen und Zahlungen.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {transactions.length === 0 ? (
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm text-white/50">
                Noch keine Transaktionen vorhanden.
              </div>
            ) : (
              transactions.map((tx) => {
                const isPositive = tx.amount > 0;

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white sm:text-base">
                        {tx.type}
                      </div>
                      <div className="mt-1 text-xs text-white/45 sm:text-sm">
                        {new Date(tx.createdAt).toLocaleString("de-CH")}
                      </div>
                    </div>

                    <div
                      className={[
                        "shrink-0 text-sm font-semibold sm:text-base",
                        isPositive ? "text-emerald-200" : "text-amber-200",
                      ].join(" ")}
                    >
                      {isPositive ? `+${tx.amount}` : tx.amount}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">
                Letzte Freischaltungen
              </div>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Diese Leads hast du bereits freigeschaltet und kannst direkt
                weiterbearbeiten.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {unlocks.length === 0 ? (
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm text-white/50">
                Noch keine Freischaltungen vorhanden.
              </div>
            ) : (
              unlocks.map((u) => (
                <div
                  key={u.id}
                  className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="text-sm font-medium text-white sm:text-base">
                    {u.lead.title}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                      {u.lead.category}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                      {u.lead.city}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-white/45 sm:text-sm">
                    Freigeschaltet am{" "}
                    {new Date(u.createdAt).toLocaleString("de-CH")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          Warum dieses Dashboard wichtig ist
        </h2>

        <div className="mt-4 space-y-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
          <p>
            Ein gutes Dashboard ist mehr als nur eine Übersicht. Es ist die
            operative Zentrale für Anbieter, die mit Auftrago aktiv arbeiten
            möchten. Genau hier entscheidest du, welche Leads interessant sind,
            wie du deine Credits einsetzt und welche Kontakte bereits offen sind.
          </p>
          <p>
            Dadurch entsteht ein klarer Arbeitsfluss: Credits verwalten, Leads
            prüfen, Kontakte freischalten und Auftragschancen nutzen. Diese
            Klarheit ist entscheidend, damit die Plattform im Alltag wirklich
            funktioniert und nicht nur gut aussieht.
          </p>
        </div>
      </div>
    </AppShell>
  );
}