import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { trackProviderActivity } from "@/lib/provider-activity";

import UnlockButton from "./unlock-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const LEAD_VIEW_DEDUPLICATION_SECONDS = 15;

type LeadDetailPageProps = {
  params: {
    id: string;
  };
};

function getCategoryIcon(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("reinigung")) {
    return "🧹";
  }

  if (
    normalizedCategory.includes("umzug") ||
    normalizedCategory.includes("transport")
  ) {
    return "🚚";
  }

  if (
    normalizedCategory.includes("garten") ||
    normalizedCategory.includes("hecke") ||
    normalizedCategory.includes("rasen")
  ) {
    return "🌿";
  }

  if (
    normalizedCategory.includes("entsorgung") ||
    normalizedCategory.includes("räumung")
  ) {
    return "♻️";
  }

  if (
    normalizedCategory.includes("hauswartung") ||
    normalizedCategory.includes("liegenschaft")
  ) {
    return "🏢";
  }

  if (
    normalizedCategory.includes("fenster") ||
    normalizedCategory.includes("storen")
  ) {
    return "🪟";
  }

  if (normalizedCategory.includes("maler")) {
    return "🎨";
  }

  return "🛠️";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getClientIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || undefined;
  }

  return (
    requestHeaders.get("x-real-ip") ||
    requestHeaders.get("cf-connecting-ip") ||
    undefined
  );
}

async function trackLeadView({
  providerId,
  lead,
  isUnlocked,
}: {
  providerId: string;
  lead: {
    id: string;
    title: string;
    category: string;
    region: string;
    price: number;
  };
  isUnlocked: boolean;
}) {
  try {
    const requestHeaders = headers();
    const userAgent =
      requestHeaders.get("user-agent") || undefined;
    const ipAddress = getClientIp(requestHeaders);

    const duplicateThreshold = new Date(
      Date.now() -
        LEAD_VIEW_DEDUPLICATION_SECONDS * 1000
    );

    const existingActivity =
      await prisma.providerActivity.findFirst({
        where: {
          providerId,
          event: "LEAD_VIEWED",
          leadId: lead.id,
          createdAt: {
            gte: duplicateThreshold,
          },
        },
        select: {
          id: true,
        },
      });

    if (existingActivity) {
      return;
    }

    await trackProviderActivity({
      providerId,
      event: "LEAD_VIEWED",
      description:
        "Anbieter hat die Detailansicht eines Leads geöffnet",
      page: `/leads/${lead.id}`,
      leadId: lead.id,
      metadata: {
        leadTitle: lead.title,
        category: lead.category,
        region: lead.region,
        price: lead.price,
        isUnlocked,
      },
      ipAddress,
      userAgent,
    });
  } catch (error) {
    /*
     * Ein Fehler im Analytics-System darf die eigentliche
     * Lead-Seite niemals blockieren.
     */
    console.error("LEAD VIEW TRACKING ERROR:", error);
  }
}

export default async function LeadDetailPage({
  params,
}: LeadDetailPageProps) {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status !== "APPROVED") {
    redirect("/login");
  }

  const leadId = String(params.id || "").trim();

  if (!leadId) {
    notFound();
  }

  const [lead, purchase] = await Promise.all([
    prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        name: true,
        email: true,
        phone: true,
        region: true,
        category: true,
        price: true,
        createdAt: true,
      },
    }),

    prisma.leadPurchase.findUnique({
      where: {
        providerId_leadId: {
          providerId: user.id,
          leadId,
        },
      },
      select: {
        id: true,
        price: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  if (!lead) {
    notFound();
  }

  const isUnlocked = Boolean(purchase);
  const categoryIcon = getCategoryIcon(lead.category);

  await trackLeadView({
    providerId: user.id,
    lead: {
      id: lead.id,
      title: lead.title,
      category: lead.category,
      region: lead.region,
      price: lead.price,
    },
    isUnlocked,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-8%] h-[420px] w-[420px] rounded-full bg-sky-400/10 blur-3xl" />

        <div className="absolute right-[-12%] top-[18%] h-[460px] w-[460px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute bottom-[-18%] left-[28%] h-[420px] w-[420px] rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/leads"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            ← Zurück zu den Aufträgen
          </Link>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3">
            <span className="text-sm text-yellow-100/60">
              Dein Guthaben:
            </span>

            <strong className="text-yellow-200">
              🪙 {user.credits} Credits
            </strong>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <article className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1427]/95 shadow-[0_30px_100px_rgba(0,0,0,0.34)]">
              <div className="border-b border-white/10 p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-3xl">
                      {categoryIcon}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-sky-200">
                          Kundenanfrage
                        </span>

                        <span
                          className={
                            isUnlocked
                              ? "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200"
                              : "rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/55"
                          }
                        >
                          {isUnlocked
                            ? "✅ Freigeschaltet"
                            : "🔒 Kontakt gesperrt"}
                        </span>
                      </div>

                      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                        {lead.title}
                      </h1>

                      <p className="mt-3 text-sm text-white/45">
                        Eingegangen am{" "}
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-yellow-400/20 bg-yellow-400/10 px-5 py-4 text-right">
                    <div className="text-3xl font-bold text-yellow-300">
                      {lead.price}
                    </div>

                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-yellow-100/55">
                      Credits
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                    Kategorie
                  </div>

                  <div className="mt-3 text-lg font-semibold">
                    {categoryIcon} {lead.category}
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                    Region
                  </div>

                  <div className="mt-3 text-lg font-semibold">
                    📍 {lead.region}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 p-6 sm:p-8">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                  Auftragsbeschreibung
                </div>

                <div className="mt-4 whitespace-pre-wrap text-base leading-8 text-white/70">
                  {lead.description}
                </div>
              </div>
            </article>

            {isUnlocked ? (
              <article className="rounded-[32px] border border-emerald-400/20 bg-[linear-gradient(145deg,rgba(16,185,129,0.14),rgba(255,255,255,0.04))] p-6 shadow-[0_24px_80px_rgba(16,185,129,0.08)] sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-200/70">
                      Freigeschalteter Kundenkontakt
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                      Kontaktdaten
                    </h2>
                  </div>

                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100">
                    ✅ Bezahlt
                  </span>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-black/10 p-5">
                    <div className="text-xs uppercase tracking-[0.13em] text-white/40">
                      Name
                    </div>

                    <div className="mt-2 text-lg font-semibold">
                      {lead.name}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/10 p-5">
                    <div className="text-xs uppercase tracking-[0.13em] text-white/40">
                      Telefonnummer
                    </div>

                    <a
                      href={`tel:${lead.phone}`}
                      className="mt-2 block text-lg font-semibold text-sky-200 hover:text-sky-100"
                    >
                      {lead.phone}
                    </a>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/10 p-5 sm:col-span-2">
                    <div className="text-xs uppercase tracking-[0.13em] text-white/40">
                      E-Mail-Adresse
                    </div>

                    <a
                      href={`mailto:${lead.email}`}
                      className="mt-2 block break-all text-lg font-semibold text-sky-200 hover:text-sky-100"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`tel:${lead.phone}`}
                    className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#04101d] transition hover:bg-sky-100"
                  >
                    📞 Jetzt anrufen
                  </a>

                  <a
                    href={`mailto:${lead.email}?subject=${encodeURIComponent(
                      `Ihre Anfrage: ${lead.title}`
                    )}`}
                    className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    ✉️ E-Mail schreiben
                  </a>
                </div>

                {purchase ? (
                  <p className="mt-6 text-sm text-white/45">
                    Freigeschaltet am{" "}
                    {formatDate(purchase.createdAt)} für{" "}
                    {purchase.price} Credits.
                  </p>
                ) : null}
              </article>
            ) : (
              <article className="rounded-[32px] border border-white/10 bg-[#0b1427]/95 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl">
                    🔒
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold">
                      Kontaktdaten sind geschützt
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
                      Name, Telefonnummer und E-Mail-Adresse
                      werden erst nach der Freischaltung
                      angezeigt. Prüfe vorher Kategorie, Region
                      und Auftragsbeschreibung.
                    </p>
                  </div>
                </div>
              </article>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {!isUnlocked ? (
              <UnlockButton
                leadId={lead.id}
                cost={lead.price}
                currentCredits={user.credits}
              />
            ) : (
              <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-6">
                <div className="text-3xl">✅</div>

                <h2 className="mt-4 text-xl font-semibold">
                  Anfrage freigeschaltet
                </h2>

                <p className="mt-3 text-sm leading-7 text-emerald-50/70">
                  Du kannst die Kundin oder den Kunden jetzt
                  direkt kontaktieren.
                </p>

                <Link
                  href="/dashboard"
                  className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#04101d]"
                >
                  Zum Anbieterbereich
                </Link>
              </div>
            )}

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                Sicher entscheiden
              </div>

              <div className="mt-5 space-y-4 text-sm leading-6 text-white/60">
                <div className="flex items-start gap-3">
                  <span>✓</span>
                  <span>
                    Keine monatliche Verpflichtung
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span>✓</span>
                  <span>
                    Kontaktdaten sofort nach Freischaltung
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span>✓</span>
                  <span>
                    Nur passende Anfragen auswählen
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/credits"
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-400 px-6 py-3 text-sm font-black text-[#171006] shadow-[0_16px_45px_rgba(250,204,21,0.14)]"
            >
              🪙 Credits kaufen
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}