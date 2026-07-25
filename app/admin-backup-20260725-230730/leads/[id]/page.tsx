import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  LeadStatus as PrismaLeadStatus,
  OfferStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
};

type AvailabilityStatus =
  | "ACTIVE"
  | "ENDING"
  | "SOLD_OUT"
  | "EXPIRED";

const purchaseStatuses: Array<{
  value: PrismaLeadStatus;
  label: string;
}> = [
  { value: "OPEN", label: "Offen" },
  { value: "CONTACTED", label: "Kontaktiert" },
  { value: "APPOINTMENT_SET", label: "Termin vereinbart" },
  { value: "OFFER_SENT", label: "Offerte gesendet" },
  { value: "WON", label: "Gewonnen" },
  { value: "LOST", label: "Verloren" },
  { value: "NO_OFFER", label: "Keine Offerte" },
];

const offerStatuses: Array<{
  value: OfferStatus;
  label: string;
}> = [
  { value: "SENT", label: "Gesendet" },
  { value: "ACCEPTED", label: "Angenommen" },
  { value: "DECLINED", label: "Abgelehnt" },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(amount);
}

function getExpiryDate(
  createdAt: Date,
  expiresAt: Date | null,
) {
  if (expiresAt) {
    return expiresAt;
  }

  return new Date(
    createdAt.getTime() + 7 * 24 * 60 * 60 * 1000,
  );
}

function getAvailabilityStatus({
  expiresAt,
  purchaseCount,
  maxPurchases,
}: {
  expiresAt: Date;
  purchaseCount: number;
  maxPurchases: number;
}): AvailabilityStatus {
  const remaining = expiresAt.getTime() - Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (purchaseCount >= maxPurchases) {
    return "SOLD_OUT";
  }

  if (remaining <= 0) {
    return "EXPIRED";
  }

  if (remaining <= oneDay) {
    return "ENDING";
  }

  return "ACTIVE";
}

function availabilityLabel(status: AvailabilityStatus) {
  if (status === "SOLD_OUT") return "Ausverkauft";
  if (status === "EXPIRED") return "Abgelaufen";
  if (status === "ENDING") return "Läuft bald ab";
  return "Aktiv";
}

function availabilityClass(status: AvailabilityStatus) {
  if (status === "SOLD_OUT") return "status status-sold";
  if (status === "EXPIRED") return "status status-expired";
  if (status === "ENDING") return "status status-ending";
  return "status status-active";
}

function purchaseStatusLabel(status: PrismaLeadStatus) {
  return (
    purchaseStatuses.find((item) => item.value === status)
      ?.label ?? status
  );
}

function purchaseStatusClass(status: PrismaLeadStatus) {
  if (status === "WON") return "purchase-status won";
  if (status === "LOST" || status === "NO_OFFER") {
    return "purchase-status lost";
  }

  if (
    status === "CONTACTED" ||
    status === "APPOINTMENT_SET" ||
    status === "OFFER_SENT"
  ) {
    return "purchase-status progress";
  }

  return "purchase-status open";
}

function offerStatusLabel(status: OfferStatus) {
  return (
    offerStatuses.find((item) => item.value === status)
      ?.label ?? status
  );
}

function offerStatusClass(status: OfferStatus) {
  if (status === "ACCEPTED") return "offer-status accepted";
  if (status === "DECLINED") return "offer-status declined";
  return "offer-status sent";
}

function getMessage(message?: string) {
  if (message === "lead-updated") {
    return "Lead wurde erfolgreich aktualisiert.";
  }

  if (message === "extended") {
    return "Lead wurde um 7 Tage verlängert.";
  }

  if (message === "purchase-updated") {
    return "Anbieterstatus wurde aktualisiert.";
  }

  if (message === "note-created") {
    return "Notiz wurde gespeichert.";
  }

  if (message === "message-created") {
    return "Nachricht wurde gespeichert.";
  }

  if (message === "offer-created") {
    return "Offerte wurde erstellt.";
  }

  if (message === "offer-updated") {
    return "Offertenstatus wurde aktualisiert.";
  }

  return "";
}

function getError(error?: string) {
  if (error === "invalid-data") {
    return "Bitte prüfe die eingegebenen Daten.";
  }

  if (error === "purchase-not-found") {
    return "Der Leadkauf wurde nicht gefunden.";
  }

  if (error === "duplicate-email") {
    return "Diese E-Mail-Adresse wird bereits verwendet.";
  }

  return "";
}

export default async function AdminLeadDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = searchParams
    ? await searchParams
    : undefined;

  const lead = await prisma.lead.findUnique({
    where: {
      id,
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          provider: {
            select: {
              id: true,
              companyName: true,
              contactName: true,
              email: true,
              phone: true,
              status: true,
              credits: true,
              city: true,
            },
          },
          notes: {
            orderBy: {
              createdAt: "desc",
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
          },
          activities: {
            orderBy: {
              createdAt: "desc",
            },
          },
          offers: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  async function updateLead(formData: FormData) {
    "use server";

    const leadId = String(formData.get("leadId") || "");
    const title = String(formData.get("title") || "").trim();
    const description = String(
      formData.get("description") || "",
    ).trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const phone = String(formData.get("phone") || "").trim();
    const region = String(formData.get("region") || "").trim();
    const category = String(
      formData.get("category") || "",
    ).trim();
    const postalCode = String(
      formData.get("postalCode") || "",
    ).trim();
    const city = String(formData.get("city") || "").trim();

    const price = Number(formData.get("price"));
    const maxPurchases = Number(
      formData.get("maxPurchases"),
    );

    const expiresAtValue = String(
      formData.get("expiresAt") || "",
    );

    if (
      !leadId ||
      !title ||
      !description ||
      !name ||
      !email ||
      !phone ||
      !region ||
      !category ||
      !Number.isInteger(price) ||
      price < 1 ||
      !Number.isInteger(maxPurchases) ||
      maxPurchases < 1
    ) {
      redirect(
        `/admin/leads/${leadId || id}?error=invalid-data`,
      );
    }

    await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        title,
        description,
        name,
        email,
        phone,
        region,
        category,
        postalCode: postalCode || null,
        city: city || null,
        price,
        maxPurchases,
        expiresAt: expiresAtValue
          ? new Date(expiresAtValue)
          : null,
      },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");
    revalidatePath("/leads");

    redirect(
      `/admin/leads/${leadId}?message=lead-updated`,
    );
  }

  async function extendLead(formData: FormData) {
    "use server";

    const leadId = String(formData.get("leadId") || "");

    const currentLead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        createdAt: true,
        expiresAt: true,
      },
    });

    if (!currentLead) {
      redirect("/admin/leads");
    }

    const currentExpiry = getExpiryDate(
      currentLead.createdAt,
      currentLead.expiresAt,
    );

    const baseDate =
      currentExpiry.getTime() > Date.now()
        ? currentExpiry
        : new Date();

    const newExpiry = new Date(
      baseDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    );

    await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        expiresAt: newExpiry,
      },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");
    revalidatePath("/leads");

    redirect(`/admin/leads/${leadId}?message=extended`);
  }

  async function updatePurchaseStatus(
    formData: FormData,
  ) {
    "use server";

    const leadId = String(formData.get("leadId") || "");
    const purchaseId = String(
      formData.get("purchaseId") || "",
    );
    const requestedStatus = String(
      formData.get("status") || "",
    );

    const validStatus = purchaseStatuses.find(
      (item) => item.value === requestedStatus,
    );

    if (!leadId || !purchaseId || !validStatus) {
      redirect(
        `/admin/leads/${leadId || id}?error=invalid-data`,
      );
    }

    const purchase =
      await prisma.leadPurchase.findUnique({
        where: {
          id: purchaseId,
        },
        select: {
          id: true,
          status: true,
          providerId: true,
        },
      });

    if (!purchase) {
      redirect(
        `/admin/leads/${leadId}?error=purchase-not-found`,
      );
    }

    await prisma.$transaction([
      prisma.leadPurchase.update({
        where: {
          id: purchaseId,
        },
        data: {
          status: validStatus.value,
        },
      }),

      prisma.leadActivity.create({
        data: {
          leadPurchaseId: purchaseId,
          type: "STATUS_CHANGED",
          description: `Status von ${purchaseStatusLabel(
            purchase.status,
          )} auf ${purchaseStatusLabel(
            validStatus.value,
          )} geändert.`,
        },
      }),

      prisma.providerActivity.create({
        data: {
          providerId: purchase.providerId,
          event: "LEAD_STATUS_CHANGED",
          leadId,
          page: `/admin/leads/${leadId}`,
          description: `Leadstatus auf ${purchaseStatusLabel(
            validStatus.value,
          )} geändert.`,
          metadata: {
            purchaseId,
            previousStatus: purchase.status,
            newStatus: validStatus.value,
          },
        },
      }),
    ]);

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");

    redirect(
      `/admin/leads/${leadId}?message=purchase-updated`,
    );
  }

  async function createNote(formData: FormData) {
    "use server";

    const leadId = String(formData.get("leadId") || "");
    const purchaseId = String(
      formData.get("purchaseId") || "",
    );
    const content = String(
      formData.get("content") || "",
    ).trim();

    if (!leadId || !purchaseId || !content) {
      redirect(
        `/admin/leads/${leadId || id}?error=invalid-data`,
      );
    }

    await prisma.$transaction([
      prisma.leadNote.create({
        data: {
          leadPurchaseId: purchaseId,
          content,
        },
      }),

      prisma.leadActivity.create({
        data: {
          leadPurchaseId: purchaseId,
          type: "NOTE_CREATED",
          description: "Eine interne Notiz wurde erstellt.",
        },
      }),
    ]);

    revalidatePath(`/admin/leads/${leadId}`);

    redirect(
      `/admin/leads/${leadId}?message=note-created`,
    );
  }

  async function createMessage(formData: FormData) {
    "use server";

    const leadId = String(formData.get("leadId") || "");
    const purchaseId = String(
      formData.get("purchaseId") || "",
    );
    const sender = String(
      formData.get("sender") || "",
    ).trim();
    const message = String(
      formData.get("message") || "",
    ).trim();

    if (!leadId || !purchaseId || !sender || !message) {
      redirect(
        `/admin/leads/${leadId || id}?error=invalid-data`,
      );
    }

    await prisma.$transaction([
      prisma.leadMessage.create({
        data: {
          leadPurchaseId: purchaseId,
          sender,
          message,
        },
      }),

      prisma.leadActivity.create({
        data: {
          leadPurchaseId: purchaseId,
          type: "MESSAGE_CREATED",
          description: `Nachricht von ${sender} gespeichert.`,
        },
      }),
    ]);

    revalidatePath(`/admin/leads/${leadId}`);

    redirect(
      `/admin/leads/${leadId}?message=message-created`,
    );
  }

  async function createOffer(formData: FormData) {
    "use server";

    const leadId = String(formData.get("leadId") || "");
    const purchaseId = String(
      formData.get("purchaseId") || "",
    );
    const title = String(formData.get("title") || "").trim();
    const description = String(
      formData.get("description") || "",
    ).trim();
    const pdfUrl = String(
      formData.get("pdfUrl") || "",
    ).trim();
    const amount = Number(formData.get("amount"));

    if (
      !leadId ||
      !purchaseId ||
      !title ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      redirect(
        `/admin/leads/${leadId || id}?error=invalid-data`,
      );
    }

    await prisma.$transaction([
      prisma.leadOffer.create({
        data: {
          leadPurchaseId: purchaseId,
          title,
          description: description || null,
          amount,
          pdfUrl: pdfUrl || null,
          status: "SENT",
        },
      }),

      prisma.leadPurchase.update({
        where: {
          id: purchaseId,
        },
        data: {
          status: "OFFER_SENT",
        },
      }),

      prisma.leadActivity.create({
        data: {
          leadPurchaseId: purchaseId,
          type: "OFFER_CREATED",
          description: `Offerte über ${formatMoney(
            amount,
          )} wurde erstellt.`,
        },
      }),
    ]);

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");

    redirect(
      `/admin/leads/${leadId}?message=offer-created`,
    );
  }

  async function updateOfferStatus(
    formData: FormData,
  ) {
    "use server";

    const leadId = String(formData.get("leadId") || "");
    const offerId = String(formData.get("offerId") || "");
    const requestedStatus = String(
      formData.get("status") || "",
    );

    const validStatus = offerStatuses.find(
      (item) => item.value === requestedStatus,
    );

    if (!leadId || !offerId || !validStatus) {
      redirect(
        `/admin/leads/${leadId || id}?error=invalid-data`,
      );
    }

    const offer = await prisma.leadOffer.findUnique({
      where: {
        id: offerId,
      },
      select: {
        leadPurchaseId: true,
      },
    });

    if (!offer) {
      redirect(
        `/admin/leads/${leadId}?error=invalid-data`,
      );
    }

    const purchaseStatus =
      validStatus.value === "ACCEPTED"
        ? PrismaLeadStatus.WON
        : validStatus.value === "DECLINED"
          ? PrismaLeadStatus.LOST
          : PrismaLeadStatus.OFFER_SENT;

    await prisma.$transaction([
      prisma.leadOffer.update({
        where: {
          id: offerId,
        },
        data: {
          status: validStatus.value,
        },
      }),

      prisma.leadPurchase.update({
        where: {
          id: offer.leadPurchaseId,
        },
        data: {
          status: purchaseStatus,
        },
      }),

      prisma.leadActivity.create({
        data: {
          leadPurchaseId: offer.leadPurchaseId,
          type: "OFFER_STATUS_CHANGED",
          description: `Offertenstatus auf ${offerStatusLabel(
            validStatus.value,
          )} geändert.`,
        },
      }),
    ]);

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");

    redirect(
      `/admin/leads/${leadId}?message=offer-updated`,
    );
  }

  const maxPurchases =
    lead.maxPurchases > 0 ? lead.maxPurchases : 4;

  const expiryDate = getExpiryDate(
    lead.createdAt,
    lead.expiresAt,
  );

  const availabilityStatus = getAvailabilityStatus({
    expiresAt: expiryDate,
    purchaseCount: lead.purchases.length,
    maxPurchases,
  });

  const remainingSlots = Math.max(
    0,
    maxPurchases - lead.purchases.length,
  );

  const totalCreditRevenue = lead.purchases.reduce(
    (sum, purchase) => sum + purchase.price,
    0,
  );

  const totalOffers = lead.purchases.reduce(
    (sum, purchase) => sum + purchase.offers.length,
    0,
  );

  const acceptedOffers = lead.purchases.reduce(
    (sum, purchase) =>
      sum +
      purchase.offers.filter(
        (offer) => offer.status === "ACCEPTED",
      ).length,
    0,
  );

  const totalOfferValue = lead.purchases.reduce(
    (sum, purchase) =>
      sum +
      purchase.offers.reduce(
        (offerSum, offer) => offerSum + offer.amount,
        0,
      ),
    0,
  );

  const timeline = lead.purchases
    .flatMap((purchase) => [
      {
        id: `purchase-${purchase.id}`,
        createdAt: purchase.createdAt,
        type: "PURCHASE",
        title: "Lead gekauft",
        description: `${purchase.provider.companyName} kaufte den Lead für ${purchase.price} Credits.`,
        provider: purchase.provider.companyName,
      },

      ...purchase.activities.map((activity) => ({
        id: `activity-${activity.id}`,
        createdAt: activity.createdAt,
        type: activity.type,
        title: "Aktivität",
        description: activity.description,
        provider: purchase.provider.companyName,
      })),

      ...purchase.notes.map((note) => ({
        id: `note-${note.id}`,
        createdAt: note.createdAt,
        type: "NOTE",
        title: "Interne Notiz",
        description: note.content,
        provider: purchase.provider.companyName,
      })),

      ...purchase.messages.map((message) => ({
        id: `message-${message.id}`,
        createdAt: message.createdAt,
        type: "MESSAGE",
        title: `Nachricht von ${message.sender}`,
        description: message.message,
        provider: purchase.provider.companyName,
      })),

      ...purchase.offers.map((offer) => ({
        id: `offer-${offer.id}`,
        createdAt: offer.createdAt,
        type: "OFFER",
        title: `Offerte: ${offer.title}`,
        description: `${formatMoney(
          offer.amount,
        )} · ${offerStatusLabel(offer.status)}`,
        provider: purchase.provider.companyName,
      })),
    ])
    .sort(
      (a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime(),
    );

  const successMessage = getMessage(query?.message);
  const errorMessage = getError(query?.error);

  const wonPurchases = lead.purchases.filter(
    (purchase) => purchase.status === "WON",
  ).length;

  const progressedPurchases = lead.purchases.filter(
    (purchase) =>
      purchase.status === "CONTACTED" ||
      purchase.status === "APPOINTMENT_SET" ||
      purchase.status === "OFFER_SENT" ||
      purchase.status === "WON",
  ).length;

  const leadScore = Math.min(
    100,
    Math.round(
      (lead.purchases.length / Math.max(maxPurchases, 1)) * 35 +
        (progressedPurchases / Math.max(lead.purchases.length, 1)) * 25 +
        (totalOffers > 0 ? 20 : 0) +
        (acceptedOffers > 0 ? 20 : 0),
    ),
  );

  const leadPriority =
    availabilityStatus === "ENDING" ||
    (remainingSlots <= 1 && availabilityStatus === "ACTIVE")
      ? "Hoch"
      : leadScore >= 65
        ? "Hoch"
        : leadScore >= 35
          ? "Mittel"
          : "Niedrig";

  const closeProbability =
    acceptedOffers > 0
      ? 95
      : wonPurchases > 0
        ? 90
        : totalOffers > 0
          ? Math.min(85, 45 + totalOffers * 10)
          : progressedPurchases > 0
            ? Math.min(65, 25 + progressedPurchases * 10)
            : Math.min(35, 10 + lead.purchases.length * 8);

  const nextBestAction =
    availabilityStatus === "EXPIRED"
      ? {
          title: "Lead reaktivieren oder archivieren",
          text: "Der Lead ist abgelaufen. Prüfe, ob eine Verlängerung sinnvoll ist oder ob der Datensatz abgeschlossen werden kann.",
          cta: "7 Tage verlängern",
        }
      : availabilityStatus === "ENDING"
        ? {
            title: "Heute aktiv nachfassen",
            text: "Der Lead läuft bald ab. Kontaktiere Käufer mit offenem oder laufendem Status und prüfe ausstehende Offerten.",
            cta: "Jetzt nachfassen",
          }
        : totalOffers === 0 && lead.purchases.length > 0
          ? {
              title: "Erste Offerte beschleunigen",
              text: "Der Lead wurde bereits gekauft, aber es ist noch keine Offerte hinterlegt. Das ist aktuell der wichtigste nächste Schritt.",
              cta: "Offerte erfassen",
            }
          : acceptedOffers > 0
            ? {
                title: "Gewonnenen Auftrag absichern",
                text: "Mindestens eine Offerte wurde angenommen. Prüfe, ob Status, Notizen und nächste operative Schritte vollständig dokumentiert sind.",
                cta: "CRM prüfen",
              }
            : {
                title: "Anbieteraktivität erhöhen",
                text: "Mehr Aktivität im Verkaufsprozess verbessert die Chance auf einen erfolgreichen Abschluss.",
                cta: "Status aktualisieren",
              };

  const dateTimeValue = lead.expiresAt
    ? new Date(
        lead.expiresAt.getTime() -
          lead.expiresAt.getTimezoneOffset() * 60 * 1000,
      )
        .toISOString()
        .slice(0, 16)
    : "";

  return (
    <main className="crm-page">
      <div className="crm-shell">
        <header className="crm-header">
          <div>
            <Link
              href="/admin/leads"
              className="back-link"
            >
              ← Zurück zur Lead-Zentrale
            </Link>

            <div className="header-label">
              <span className="online-dot" />
              AUFTRAGO LEAD CRM
            </div>

            <div className="title-row">
              <h1>{lead.title}</h1>

              <span
                className={availabilityClass(
                  availabilityStatus,
                )}
              >
                {availabilityLabel(availabilityStatus)}
              </span>
            </div>

            <p>
              Lead-ID: <strong>{lead.id}</strong>
            </p>
          </div>

          <div className="header-actions">
            <a
              href={`tel:${lead.phone}`}
              className="button button-secondary"
            >
              📞 Anrufen
            </a>

            <a
              href={`mailto:${lead.email}`}
              className="button button-secondary"
            >
              ✉️ E-Mail
            </a>

            <form action={extendLead}>
              <input
                type="hidden"
                name="leadId"
                value={lead.id}
              />

              <button className="button button-primary">
                + 7 Tage verlängern
              </button>
            </form>
          </div>
        </header>

        {successMessage ? (
          <div className="notice notice-success">
            ✅ {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="notice notice-error">
            ❌ {errorMessage}
          </div>
        ) : null}

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1.4fr) minmax(280px, 0.8fr)",
            gap: 16,
          }}
          className="crm-ai-grid"
        >
          <article
            style={{
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: 26,
              background:
                "radial-gradient(circle at 86% 18%, rgba(56,189,248,0.18), transparent 28%), linear-gradient(135deg, rgba(8,47,73,0.5), rgba(8,23,42,0.96))",
              padding: 24,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                padding: "7px 11px",
                borderRadius: 999,
                background: "rgba(56,189,248,0.1)",
                color: "#7dd3fc",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              ✦ CRM Intelligence
            </span>

            <h2
              style={{
                margin: "14px 0 0",
                fontSize: "clamp(24px, 3vw, 34px)",
                lineHeight: 1.15,
              }}
            >
              {nextBestAction.title}
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                maxWidth: 780,
                color: "#a8b3c7",
                fontSize: 14,
                lineHeight: 1.75,
              }}
            >
              {nextBestAction.text}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 10,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  padding: 14,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.045)",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#64748b",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Lead Score
                </small>
                <strong
                  style={{
                    display: "block",
                    marginTop: 7,
                    fontSize: 24,
                  }}
                >
                  {leadScore}/100
                </strong>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.045)",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#64748b",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Priorität
                </small>
                <strong
                  style={{
                    display: "block",
                    marginTop: 7,
                    fontSize: 24,
                  }}
                >
                  {leadPriority}
                </strong>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.045)",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#64748b",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Abschlusschance
                </small>
                <strong
                  style={{
                    display: "block",
                    marginTop: 7,
                    fontSize: 24,
                  }}
                >
                  {closeProbability}%
                </strong>
              </div>
            </div>
          </article>

          <article
            style={{
              border: "1px solid rgba(167, 139, 250, 0.18)",
              borderRadius: 26,
              background:
                "linear-gradient(145deg, rgba(99,102,241,0.14), rgba(8,23,42,0.96))",
              padding: 24,
            }}
          >
            <span
              style={{
                color: "#c4b5fd",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Verkaufsstatus
            </span>

            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 16,
              }}
            >
              {[
                ["Käufer", lead.purchases.length],
                ["In Bearbeitung", progressedPurchases],
                ["Gewonnen", wonPurchases],
                ["Offerten", totalOffers],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
                  >
                    {label}
                  </span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 16,
                background: "rgba(255,255,255,0.045)",
              }}
            >
              <small
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Empfohlene Aktion
              </small>
              <strong
                style={{
                  display: "block",
                  marginTop: 7,
                  color: "#ffffff",
                  fontSize: 14,
                }}
              >
                {nextBestAction.cta}
              </strong>
            </div>
          </article>
        </section>

        <section className="stats-grid">
          <StatCard
            label="LEADPREIS"
            value={lead.price}
            description="Credits pro Anbieter"
          />

          <StatCard
            label="VERKAUFT"
            value={`${lead.purchases.length}/${maxPurchases}`}
            description={`${remainingSlots} Plätze verfügbar`}
          />

          <StatCard
            label="UMSATZ"
            value={totalCreditRevenue}
            description="Credits eingenommen"
          />

          <StatCard
            label="OFFERTEN"
            value={totalOffers}
            description={`${acceptedOffers} angenommen`}
          />

          <StatCard
            label="OFFERTENVOLUMEN"
            value={formatMoney(totalOfferValue)}
            description="Gesamter Offertenwert"
          />

          <StatCard
            label="ABLAUF"
            value={formatDate(expiryDate)}
            description={formatDateTime(expiryDate)}
          />
        </section>

        <section className="main-grid">
          <div className="main-column">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">
                    KUNDENDATEN
                  </span>
                  <h2>Lead bearbeiten</h2>
                </div>

                <span className="panel-icon">✏️</span>
              </div>

              <form
                action={updateLead}
                className="edit-form"
              >
                <input
                  type="hidden"
                  name="leadId"
                  value={lead.id}
                />

                <label className="field-group full">
                  <span>Titel</span>
                  <input
                    name="title"
                    defaultValue={lead.title}
                    required
                  />
                </label>

                <label className="field-group full">
                  <span>Beschreibung</span>
                  <textarea
                    name="description"
                    defaultValue={lead.description}
                    required
                  />
                </label>

                <label className="field-group">
                  <span>Kundenname</span>
                  <input
                    name="name"
                    defaultValue={lead.name}
                    required
                  />
                </label>

                <label className="field-group">
                  <span>Telefon</span>
                  <input
                    name="phone"
                    defaultValue={lead.phone}
                    required
                  />
                </label>

                <label className="field-group full">
                  <span>E-Mail-Adresse</span>
                  <input
                    name="email"
                    type="email"
                    defaultValue={lead.email}
                    required
                  />
                </label>

                <label className="field-group">
                  <span>Postleitzahl</span>
                  <input
                    name="postalCode"
                    defaultValue={lead.postalCode || ""}
                  />
                </label>

                <label className="field-group">
                  <span>Ort</span>
                  <input
                    name="city"
                    defaultValue={lead.city || ""}
                  />
                </label>

                <label className="field-group">
                  <span>Region</span>
                  <input
                    name="region"
                    defaultValue={lead.region}
                    required
                  />
                </label>

                <label className="field-group">
                  <span>Kategorie</span>
                  <input
                    name="category"
                    defaultValue={lead.category}
                    required
                  />
                </label>

                <label className="field-group">
                  <span>Leadpreis in Credits</span>
                  <input
                    name="price"
                    type="number"
                    min="1"
                    defaultValue={lead.price}
                    required
                  />
                </label>

                <label className="field-group">
                  <span>Maximale Käufer</span>
                  <input
                    name="maxPurchases"
                    type="number"
                    min="1"
                    defaultValue={maxPurchases}
                    required
                  />
                </label>

                <label className="field-group full">
                  <span>Ablaufdatum</span>
                  <input
                    name="expiresAt"
                    type="datetime-local"
                    defaultValue={dateTimeValue}
                  />
                </label>

                <button className="button button-primary full">
                  💾 Lead speichern
                </button>
              </form>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">
                    ANBIETER
                  </span>
                  <h2>Käufer und Verkaufsprozess</h2>
                </div>

                <strong className="panel-count">
                  {lead.purchases.length}
                </strong>
              </div>

              {lead.purchases.length === 0 ? (
                <div className="empty-state">
                  <span>📭</span>
                  <strong>Noch keine Käufer</strong>
                  <p>
                    Sobald ein Anbieter den Lead kauft,
                    erscheint er hier.
                  </p>
                </div>
              ) : (
                <div className="purchase-list">
                  {lead.purchases.map((purchase) => (
                    <article
                      className="purchase-card"
                      key={purchase.id}
                    >
                      <div className="purchase-top">
                        <div className="provider-profile">
                          <div className="provider-avatar">
                            {purchase.provider.companyName
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div>
                            <Link
                              href={`/admin/providers/${purchase.provider.id}`}
                            >
                              {
                                purchase.provider
                                  .companyName
                              }
                            </Link>

                            <span>
                              {
                                purchase.provider
                                  .contactName
                              }{" "}
                              · {purchase.provider.email}
                            </span>
                          </div>
                        </div>

                        <span
                          className={purchaseStatusClass(
                            purchase.status,
                          )}
                        >
                          {purchaseStatusLabel(
                            purchase.status,
                          )}
                        </span>
                      </div>

                      <div className="purchase-metrics">
                        <div>
                          <span>Kaufpreis</span>
                          <strong>
                            {purchase.price} Credits
                          </strong>
                        </div>

                        <div>
                          <span>Gekauft</span>
                          <strong>
                            {formatDateTime(
                              purchase.createdAt,
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Offerten</span>
                          <strong>
                            {purchase.offers.length}
                          </strong>
                        </div>

                        <div>
                          <span>Notizen</span>
                          <strong>
                            {purchase.notes.length}
                          </strong>
                        </div>
                      </div>

                      <form
                        action={updatePurchaseStatus}
                        className="inline-form"
                      >
                        <input
                          type="hidden"
                          name="leadId"
                          value={lead.id}
                        />

                        <input
                          type="hidden"
                          name="purchaseId"
                          value={purchase.id}
                        />

                        <select
                          name="status"
                          defaultValue={purchase.status}
                        >
                          {purchaseStatuses.map(
                            (status) => (
                              <option
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </option>
                            ),
                          )}
                        </select>

                        <button className="button button-secondary">
                          Status speichern
                        </button>
                      </form>

                      <details className="workspace">
                        <summary>
                          CRM-Arbeitsbereich öffnen ↓
                        </summary>

                        <div className="workspace-grid">
                          <section className="workspace-panel">
                            <h3>Interne Notiz</h3>

                            <form action={createNote}>
                              <input
                                type="hidden"
                                name="leadId"
                                value={lead.id}
                              />

                              <input
                                type="hidden"
                                name="purchaseId"
                                value={purchase.id}
                              />

                              <textarea
                                name="content"
                                placeholder="Interne Notiz zum Anbieter oder Verkaufsprozess"
                                required
                              />

                              <button className="button button-primary">
                                Notiz speichern
                              </button>
                            </form>

                            <div className="mini-list">
                              {purchase.notes.length ===
                              0 ? (
                                <p className="muted">
                                  Noch keine Notizen.
                                </p>
                              ) : (
                                purchase.notes.map(
                                  (note) => (
                                    <div
                                      className="mini-card"
                                      key={note.id}
                                    >
                                      <p>
                                        {note.content}
                                      </p>
                                      <time>
                                        {formatDateTime(
                                          note.createdAt,
                                        )}
                                      </time>
                                    </div>
                                  ),
                                )
                              )}
                            </div>
                          </section>

                          <section className="workspace-panel">
                            <h3>Nachricht speichern</h3>

                            <form action={createMessage}>
                              <input
                                type="hidden"
                                name="leadId"
                                value={lead.id}
                              />

                              <input
                                type="hidden"
                                name="purchaseId"
                                value={purchase.id}
                              />

                              <input
                                name="sender"
                                placeholder="Absender, z. B. Anbieter"
                                required
                              />

                              <textarea
                                name="message"
                                placeholder="Nachricht oder Gesprächsnotiz"
                                required
                              />

                              <button className="button button-primary">
                                Nachricht speichern
                              </button>
                            </form>

                            <div className="mini-list">
                              {purchase.messages.length ===
                              0 ? (
                                <p className="muted">
                                  Noch keine Nachrichten.
                                </p>
                              ) : (
                                purchase.messages.map(
                                  (message) => (
                                    <div
                                      className="mini-card"
                                      key={message.id}
                                    >
                                      <strong>
                                        {message.sender}
                                      </strong>

                                      <p>
                                        {message.message}
                                      </p>

                                      <time>
                                        {formatDateTime(
                                          message.createdAt,
                                        )}
                                      </time>
                                    </div>
                                  ),
                                )
                              )}
                            </div>
                          </section>

                          <section className="workspace-panel full-workspace">
                            <h3>Neue Offerte</h3>

                            <form
                              action={createOffer}
                              className="offer-form"
                            >
                              <input
                                type="hidden"
                                name="leadId"
                                value={lead.id}
                              />

                              <input
                                type="hidden"
                                name="purchaseId"
                                value={purchase.id}
                              />

                              <input
                                name="title"
                                placeholder="Titel der Offerte"
                                required
                              />

                              <input
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="Betrag in CHF"
                                required
                              />

                              <input
                                name="pdfUrl"
                                placeholder="PDF-URL optional"
                              />

                              <textarea
                                name="description"
                                placeholder="Beschreibung optional"
                              />

                              <button className="button button-primary">
                                Offerte erstellen
                              </button>
                            </form>

                            <div className="offer-list">
                              {purchase.offers.length ===
                              0 ? (
                                <p className="muted">
                                  Noch keine Offerten.
                                </p>
                              ) : (
                                purchase.offers.map(
                                  (offer) => (
                                    <article
                                      className="offer-card"
                                      key={offer.id}
                                    >
                                      <div>
                                        <span
                                          className={offerStatusClass(
                                            offer.status,
                                          )}
                                        >
                                          {offerStatusLabel(
                                            offer.status,
                                          )}
                                        </span>

                                        <h4>
                                          {offer.title}
                                        </h4>

                                        <strong>
                                          {formatMoney(
                                            offer.amount,
                                          )}
                                        </strong>

                                        {offer.description ? (
                                          <p>
                                            {
                                              offer.description
                                            }
                                          </p>
                                        ) : null}

                                        <time>
                                          {formatDateTime(
                                            offer.createdAt,
                                          )}
                                        </time>
                                      </div>

                                      <div className="offer-actions">
                                        {offer.pdfUrl ? (
                                          <a
                                            href={offer.pdfUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="button button-secondary"
                                          >
                                            PDF öffnen
                                          </a>
                                        ) : null}

                                        <form
                                          action={
                                            updateOfferStatus
                                          }
                                        >
                                          <input
                                            type="hidden"
                                            name="leadId"
                                            value={lead.id}
                                          />

                                          <input
                                            type="hidden"
                                            name="offerId"
                                            value={offer.id}
                                          />

                                          <select
                                            name="status"
                                            defaultValue={
                                              offer.status
                                            }
                                          >
                                            {offerStatuses.map(
                                              (
                                                status,
                                              ) => (
                                                <option
                                                  key={
                                                    status.value
                                                  }
                                                  value={
                                                    status.value
                                                  }
                                                >
                                                  {
                                                    status.label
                                                  }
                                                </option>
                                              ),
                                            )}
                                          </select>

                                          <button className="button button-secondary">
                                            Aktualisieren
                                          </button>
                                        </form>
                                      </div>
                                    </article>
                                  ),
                                )
                              )}
                            </div>
                          </section>
                        </div>
                      </details>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="sidebar">
            <section className="panel customer-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">
                    KONTAKT
                  </span>
                  <h2>Kunde</h2>
                </div>
              </div>

              <div className="customer-avatar">
                {lead.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <strong className="customer-name">
                {lead.name}
              </strong>

              <div className="info-list">
                <a href={`tel:${lead.phone}`}>
                  <span>Telefon</span>
                  <strong>{lead.phone}</strong>
                </a>

                <a href={`mailto:${lead.email}`}>
                  <span>E-Mail</span>
                  <strong>{lead.email}</strong>
                </a>

                <div>
                  <span>Standort</span>
                  <strong>
                    {[lead.postalCode, lead.city]
                      .filter(Boolean)
                      .join(" ") || "Nicht angegeben"}
                  </strong>
                </div>

                <div>
                  <span>Region</span>
                  <strong>{lead.region}</strong>
                </div>

                <div>
                  <span>Kategorie</span>
                  <strong>{lead.category}</strong>
                </div>

                <div>
                  <span>Erstellt</span>
                  <strong>
                    {formatDateTime(lead.createdAt)}
                  </strong>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">
                    TIMELINE
                  </span>
                  <h2>Aktivitäten</h2>
                </div>

                <strong className="panel-count">
                  {timeline.length}
                </strong>
              </div>

              {timeline.length === 0 ? (
                <div className="empty-state compact">
                  <span>⚡</span>
                  <strong>Keine Aktivitäten</strong>
                </div>
              ) : (
                <div className="timeline">
                  {timeline.map((item) => (
                    <div
                      className="timeline-item"
                      key={item.id}
                    >
                      <div className="timeline-dot" />

                      <div>
                        <strong>{item.title}</strong>

                        <span>{item.provider}</span>

                        <p>{item.description}</p>

                        <time>
                          {formatDateTime(
                            item.createdAt,
                          )}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .crm-page {
          min-height: 100vh;
          padding: 38px 0 80px;
          color: #f8fafc;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(14, 165, 233, 0.18),
              transparent 30%
            ),
            radial-gradient(
              circle at 92% 7%,
              rgba(99, 102, 241, 0.22),
              transparent 34%
            ),
            linear-gradient(
              180deg,
              #071426,
              #07101d
            );
        }

        .crm-shell {
          width: min(1480px, calc(100% - 40px));
          margin: 0 auto;
        }

        .crm-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 18px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .header-label {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #c4b5fd;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .online-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.8);
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 13px;
        }

        .title-row h1 {
          margin: 0;
          font-size: clamp(36px, 5vw, 62px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .crm-header p {
          margin: 12px 0 0;
          color: #64748b;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .button {
          appearance: none;
          min-height: 45px;
          padding: 0 16px;
          border: 0;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: inherit;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .button:hover {
          transform: translateY(-1px);
        }

        .button-primary {
          color: white;
          background: linear-gradient(
            135deg,
            #0ea5e9,
            #6366f1
          );
          box-shadow: 0 14px 35px rgba(14, 165, 233, 0.18);
        }

        .button-secondary {
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.055);
        }

        .notice {
          margin-top: 24px;
          padding: 16px 18px;
          border-radius: 17px;
          font-size: 13px;
          font-weight: 800;
        }

        .notice-success {
          color: #bbf7d0;
          border: 1px solid rgba(34, 197, 94, 0.28);
          background: rgba(34, 197, 94, 0.11);
        }

        .notice-error {
          color: #fecaca;
          border: 1px solid rgba(239, 68, 68, 0.28);
          background: rgba(239, 68, 68, 0.11);
        }

        .status,
        .purchase-status,
        .offer-status {
          display: inline-flex;
          align-items: center;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }

        .status-active {
          color: #bbf7d0;
          border-color: rgba(34, 197, 94, 0.27);
          background: rgba(34, 197, 94, 0.11);
        }

        .status-ending {
          color: #fde68a;
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.11);
        }

        .status-sold {
          color: #e2e8f0;
          border-color: rgba(148, 163, 184, 0.3);
          background: rgba(148, 163, 184, 0.1);
        }

        .status-expired {
          color: #fecaca;
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(6, minmax(0, 1fr));
          gap: 13px;
          margin-top: 30px;
        }

        .stat-card {
          min-height: 130px;
          padding: 19px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            radial-gradient(
              circle at 100% 100%,
              rgba(255, 255, 255, 0.07),
              transparent 36%
            ),
            rgba(15, 31, 54, 0.85);
        }

        .stat-card span {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .stat-card strong {
          display: block;
          margin-top: 21px;
          font-size: 25px;
          line-height: 1;
          letter-spacing: -0.035em;
        }

        .stat-card small {
          display: block;
          margin-top: 9px;
          color: #64748b;
          font-size: 11px;
        }

        .main-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 380px;
          gap: 20px;
          align-items: start;
          margin-top: 20px;
        }

        .main-column,
        .sidebar {
          display: grid;
          gap: 20px;
        }

        .panel {
          min-width: 0;
          padding: 23px;
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(8, 23, 42, 0.88);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 21px;
        }

        .eyebrow {
          display: block;
          color: #818cf8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .panel-header h2 {
          margin: 5px 0 0;
          font-size: 21px;
          letter-spacing: -0.025em;
        }

        .panel-icon,
        .panel-count {
          min-width: 44px;
          height: 44px;
          padding: 0 12px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.055);
        }

        .edit-form {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .field-group {
          min-width: 0;
          display: grid;
          gap: 7px;
        }

        .field-group.full,
        .edit-form .full {
          grid-column: 1 / -1;
        }

        .field-group > span {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
        }

        input,
        select,
        textarea {
          width: 100%;
          min-height: 46px;
          padding: 0 13px;
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 13px;
          outline: none;
          background: rgba(255, 255, 255, 0.05);
          font: inherit;
        }

        textarea {
          min-height: 110px;
          padding: 13px;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(56, 189, 248, 0.62);
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.08);
        }

        select option {
          color: #0f172a;
        }

        .purchase-list {
          display: grid;
          gap: 14px;
        }

        .purchase-card {
          padding: 18px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
        }

        .purchase-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
        }

        .provider-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .provider-avatar {
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            #0ea5e9,
            #6366f1
          );
          font-weight: 950;
        }

        .provider-profile a,
        .provider-profile span {
          display: block;
        }

        .provider-profile a {
          color: white;
          font-weight: 900;
          text-decoration: none;
        }

        .provider-profile span {
          margin-top: 4px;
          color: #64748b;
          font-size: 11px;
        }

        .purchase-status.won,
        .offer-status.accepted {
          color: #bbf7d0;
          border-color: rgba(34, 197, 94, 0.25);
          background: rgba(34, 197, 94, 0.1);
        }

        .purchase-status.lost,
        .offer-status.declined {
          color: #fecaca;
          border-color: rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.1);
        }

        .purchase-status.progress,
        .offer-status.sent {
          color: #bae6fd;
          border-color: rgba(14, 165, 233, 0.25);
          background: rgba(14, 165, 233, 0.1);
        }

        .purchase-status.open {
          color: #fde68a;
          border-color: rgba(245, 158, 11, 0.25);
          background: rgba(245, 158, 11, 0.1);
        }

        .purchase-metrics {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 9px;
          margin-top: 16px;
        }

        .purchase-metrics > div {
          padding: 11px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.035);
        }

        .purchase-metrics span,
        .purchase-metrics strong {
          display: block;
        }

        .purchase-metrics span {
          color: #64748b;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .purchase-metrics strong {
          margin-top: 6px;
          font-size: 11px;
        }

        .inline-form {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          margin-top: 13px;
        }

        .workspace {
          margin-top: 14px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .workspace summary {
          padding: 14px;
          color: #bae6fd;
          list-style: none;
          text-align: center;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          background: rgba(14, 165, 233, 0.045);
        }

        .workspace summary::-webkit-details-marker {
          display: none;
        }

        .workspace-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 13px;
          padding: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .workspace-panel {
          min-width: 0;
          padding: 15px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.03);
        }

        .workspace-panel h3 {
          margin: 0 0 13px;
          font-size: 15px;
        }

        .workspace-panel form {
          display: grid;
          gap: 9px;
        }

        .full-workspace {
          grid-column: 1 / -1;
        }

        .mini-list,
        .offer-list {
          display: grid;
          gap: 8px;
          margin-top: 13px;
        }

        .mini-card {
          padding: 11px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.04);
        }

        .mini-card p {
          margin: 0;
          color: #cbd5e1;
          font-size: 12px;
          line-height: 1.55;
        }

        .mini-card strong {
          display: block;
          margin-bottom: 5px;
          font-size: 11px;
        }

        .mini-card time,
        .offer-card time {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 9px;
        }

        .offer-form {
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
        }

        .offer-form textarea,
        .offer-form button {
          grid-column: 1 / -1;
        }

        .offer-card {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
        }

        .offer-card h4 {
          margin: 10px 0 5px;
        }

        .offer-card p {
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.5;
        }

        .offer-actions {
          min-width: 190px;
          display: grid;
          gap: 8px;
        }

        .offer-actions form {
          display: grid;
          gap: 8px;
        }

        .customer-avatar {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          margin: 0 auto;
          border-radius: 22px;
          background: linear-gradient(
            135deg,
            #0ea5e9,
            #6366f1
          );
          font-size: 23px;
          font-weight: 950;
        }

        .customer-name {
          display: block;
          margin-top: 12px;
          text-align: center;
          font-size: 18px;
        }

        .info-list {
          display: grid;
          gap: 9px;
          margin-top: 18px;
        }

        .info-list > a,
        .info-list > div {
          display: block;
          padding: 12px;
          color: inherit;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.035);
          text-decoration: none;
        }

        .info-list span,
        .info-list strong {
          display: block;
        }

        .info-list span {
          color: #64748b;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .info-list strong {
          margin-top: 5px;
          overflow-wrap: anywhere;
          font-size: 11px;
        }

        .timeline {
          display: grid;
        }

        .timeline-item {
          position: relative;
          display: grid;
          grid-template-columns: 14px 1fr;
          gap: 10px;
          padding-bottom: 18px;
        }

        .timeline-item:not(:last-child)::before {
          content: "";
          position: absolute;
          top: 12px;
          bottom: 0;
          left: 5px;
          width: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .timeline-dot {
          position: relative;
          z-index: 1;
          width: 11px;
          height: 11px;
          margin-top: 3px;
          border-radius: 999px;
          background: #38bdf8;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
        }

        .timeline-item strong,
        .timeline-item span,
        .timeline-item time {
          display: block;
        }

        .timeline-item strong {
          font-size: 12px;
        }

        .timeline-item span {
          margin-top: 3px;
          color: #818cf8;
          font-size: 10px;
          font-weight: 800;
        }

        .timeline-item p {
          margin: 6px 0 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.5;
        }

        .timeline-item time {
          margin-top: 6px;
          color: #475569;
          font-size: 9px;
        }

        .empty-state {
          padding: 35px 20px;
          text-align: center;
          border-radius: 16px;
          border: 1px dashed rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.025);
        }

        .empty-state span {
          display: block;
          margin-bottom: 8px;
          font-size: 26px;
        }

        .empty-state strong {
          display: block;
        }

        .empty-state p,
        .muted {
          color: #64748b;
          font-size: 11px;
        }

        .empty-state.compact {
          padding: 22px;
        }

        @media (max-width: 980px) {
          .crm-ai-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 1220px) {
          .stats-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .main-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .crm-page {
            padding-top: 22px;
          }

          .crm-shell {
            width: min(100% - 22px, 1480px);
          }

          .header-actions,
          .header-actions form,
          .header-actions .button {
            width: 100%;
          }

          .stats-grid,
          .edit-form,
          .purchase-metrics,
          .workspace-grid,
          .offer-form,
          .sidebar {
            grid-template-columns: 1fr;
          }

          .field-group.full,
          .edit-form .full,
          .full-workspace,
          .offer-form textarea,
          .offer-form button {
            grid-column: auto;
          }

          .panel {
            padding: 17px;
          }

          .inline-form {
            grid-template-columns: 1fr;
          }

          .offer-card {
            flex-direction: column;
          }

          .offer-actions {
            width: 100%;
            min-width: 0;
          }
        }
      `}</style>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  );
}