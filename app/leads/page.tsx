import { redirect } from "next/navigation";
import AppShell from "@/app/components/app-shell";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import UnlockButton from "./unlock-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const now = new Date();

  const leads = await prisma.lead.findMany({
    where: {
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: { createdAt: "desc" },
  });

  const unlocked = await prisma.unlock.findMany({
    where: { userId: user.id },
    select: { leadId: true },
  });

  const unlockedSet = new Set(unlocked.map((u) => u.leadId));
  const unlockedCount = leads.filter((lead) => unlockedSet.has(lead.id)).length;
  const lockedCount = Math.max(leads.length - unlockedCount, 0);

  return (
    <AppShell active="leads" credits={user.credits}>
      <div>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Leads
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
          Hier findest du aktive Kundenanfragen, die zu deinem Unternehmen
          passen können. Du entscheidest selbst, welche Leads für dich
          interessant sind und welche Kontakte du freischalten möchtest.
        </p>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/45 sm:text-base sm:leading-7">
          Genau das ist der Kern von Auftrago: kein blindes Werbemodell, sondern
          ein klarer Lead-Marktplatz. Du prüfst Anfragen zuerst, investierst nur
          bei echtem Interesse und reagierst dann direkt auf konkrete
          Auftragschancen.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">
            Aktiv
          </div>
          <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {leads.length}
          </div>
          <div className="mt-1 text-sm text-white/55">
            Aktive Leads im System
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">
            Freigeschaltet
          </div>
          <div className="mt-2 text-2xl font-semibold text-emerald-200 sm:text-3xl">
            {unlockedCount}
          </div>
          <div className="mt-1 text-sm text-white/55">
            Bereits für dein Konto geöffnet
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">
            Noch gesperrt
          </div>
          <div className="mt-2 text-2xl font-semibold text-amber-200 sm:text-3xl">
            {lockedCount}
          </div>
          <div className="mt-1 text-sm text-white/55">
            Noch nicht freigeschaltete Kontakte
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-[#081122]/85 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          So arbeitest du effizient mit Leads
        </h2>

        <div className="mt-4 space-y-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
          <p>
            Prüfe zuerst, ob Kategorie, Region und Beschreibung wirklich zu
            deinem Angebot passen. Gute Leads erkennst du daran, dass der Bedarf
            klar beschrieben ist und du fachlich sowie regional sauber liefern
            kannst.
          </p>
          <p>
            Freischaltungen solltest du gezielt einsetzen. Genau das macht das
            Credits-Modell wertvoll: Du musst nicht auf gut Glück investieren,
            sondern kannst jede Anfrage kurz bewerten und dann bewusst
            entscheiden.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {leads.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-6 sm:p-8">
            <div className="text-xl font-semibold text-white">
              Aktuell keine aktiven Leads vorhanden
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Sobald neue Kundenanfragen eingehen, erscheinen sie hier in deiner
              Übersicht. Dann kannst du prüfen, welche Kontakte für dein
              Unternehmen spannend sind und welche Leads du freischalten
              möchtest.
            </p>
          </div>
        ) : (
          leads.map((lead) => {
            const isUnlocked = unlockedSet.has(lead.id);

            return (
              <div
                key={lead.id}
                className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5 md:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div>
                        <div className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
                          {lead.title}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                            {lead.category}
                          </span>

                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                            {lead.city}
                          </span>

                          <span
                            className={[
                              "rounded-full px-3 py-1 text-xs",
                              isUnlocked
                                ? "bg-emerald-500/15 text-emerald-200"
                                : "bg-amber-500/15 text-amber-200",
                            ].join(" ")}
                          >
                            {isUnlocked ? "Freigeschaltet" : "Gesperrt"}
                          </span>

                          <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
                            {lead.priceCredits} Credits
                          </span>
                        </div>
                      </div>

                      <p className="text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                        {lead.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto lg:min-w-[220px]">
                    <UnlockButton
                      leadId={lead.id}
                      priceCredits={lead.priceCredits}
                      isUnlocked={isUnlocked}
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-[20px] border border-white/10 bg-white/5 p-4 sm:mt-6 sm:p-5">
                  {!isUnlocked ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-lg font-semibold text-white">
                        Kontakt gesperrt
                      </div>
                      <div className="text-sm leading-7 text-white/60 sm:text-base">
                        Freischalten kostet{" "}
                        <span className="font-semibold text-white">
                          {lead.priceCredits} Credits
                        </span>
                        . Nach der Freischaltung siehst du Name, Telefon und
                        E-Mail des Kunden und kannst direkt Kontakt aufnehmen.
                      </div>

                      <div className="mt-2 text-sm leading-7 text-white/45">
                        Tipp: Nutze Credits besonders gezielt bei Leads, die
                        fachlich und regional gut zu deinem Unternehmen passen.
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 text-lg font-semibold text-white">
                        Kontakt freigeschaltet
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="text-xs uppercase tracking-[0.12em] text-white/45">
                            Name
                          </div>
                          <div className="mt-2 break-words text-sm font-medium text-white sm:text-base">
                            {lead.contactName}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="text-xs uppercase tracking-[0.12em] text-white/45">
                            Telefon
                          </div>
                          <div className="mt-2 break-words text-sm font-medium text-white sm:text-base">
                            {lead.contactPhone}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2 lg:col-span-1">
                          <div className="text-xs uppercase tracking-[0.12em] text-white/45">
                            E-Mail
                          </div>
                          <div className="mt-2 break-words text-sm font-medium text-white sm:text-base">
                            {lead.contactEmail}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-sm leading-7 text-white/45">
                        Jetzt kannst du den Kunden direkt kontaktieren und dein
                        Angebot abgeben oder offene Fragen klären.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          Warum diese Leads-Seite so wichtig ist
        </h2>

        <div className="mt-4 space-y-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
          <p>
            Die Leads-Seite ist der operative Kern für Anbieter. Genau hier
            entscheidet sich, welche Anfragen interessant sind, welche Kontakte
            freigeschaltet werden und wie effizient du mit deinem Budget
            arbeitest.
          </p>
          <p>
            Ein guter Lead-Bereich muss deshalb drei Dinge leisten: klare
            Übersicht, schnelle Bewertung und direkte Handlungsoptionen. Genau
            darauf ist diese Seite aufgebaut – damit Auftrago nicht nur gut
            aussieht, sondern im Alltag wirklich funktioniert.
          </p>
        </div>
      </div>
    </AppShell>
  );
}