"use client";

const QUICK_CATEGORIES = [
  ["Umzugsreinigung", "✨"],
  ["Unterhaltsreinigung", "🧽"],
  ["Fensterreinigung", "🪟"],
  ["Grundreinigung", "🧼"],
  ["Hauswartung", "🏢"],
  ["Gartenpflege", "🌿"],
  ["Umzug", "🚚"],
  ["Entsorgung", "🗑️"],
  ["Maler", "🎨"],
  ["Sanitär", "🚿"],
  ["Elektriker", "⚡"],
  ["Transport", "📦"],
];

const QUICK_REGIONS = [
  "AG","AI","AR","BE","BL","BS","FR","GE","GL","GR","JU","LU",
  "NE","NW","OW","SG","SH","SO","SZ","TG","TI","UR","VD","VS","ZG","ZH"
];

const QUICK_AMOUNTS = [300, 500, 750, 1000, 1500, 2000, 2500, 3000];



const ORDER_CATEGORIES = [
  "Umzugsreinigung",
  "Unterhaltsreinigung",
  "Fensterreinigung",
  "Grundreinigung",
  "Hauswartung",
  "Gartenpflege",
  "Umzug",
  "Entsorgung",
  "Maler",
  "Sanitär",
  "Elektriker",
  "Transport",
];

const SWISS_REGIONS = [
  "AG","AI","AR","BE","BL","BS","FR","GE","GL","GR","JU","LU",
  "NE","NW","OW","SG","SH","SO","SZ","TG","TI","UR","VD","VS","ZG","ZH"
];

function formatCHF(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(value);
}


import { FormEvent, useCallback, useEffect, useState } from "react";

type Provider = {
  id: string;
  companyName?: string | null;
  contactName?: string | null;
  region?: string | null;
  city?: string | null;
  logoUrl?: string | null;
};

type Application = {
  id: string;
  message?: string | null;
  status: string;
  createdAt: string;
  provider: Provider;
};

type PartnerOrder = {
  id: string;
  title: string;
  category: string;
  description: string;

  postalCode?: string | null;
  city?: string | null;
  region?: string | null;

  scheduledAt?: string | null;
  flexibleDate?: boolean;

  partnerAmountCents?: number;
  partnerAmountCHF?: number;

  commissionCents?: number | null;
  commissionCHF?: number;

  status: string;
  selectedProviderId?: string | null;

  commissionPaidAt?: string | null;
  contactsUnlockedAt?: string | null;

  applicationCount?: number;
  applications?: Application[];

  selectedProvider?: Provider | null;

  createdAt: string;
};

type Tab = "find" | "mine" | "create";

function money(value: number | undefined | null) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(value ?? 0);
}

function dateLabel(value?: string | null) {
  if (!value) return "Termin flexibel";

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    OPEN: "Offen",
    ASSIGNED: "Firma gewählt",
    PAYMENT_PENDING: "Provision ausstehend",
    UNLOCKED: "Freigeschaltet",
    COMPLETED: "Abgeschlossen",
    CANCELLED: "Storniert",
  };

  return labels[status] ?? status;
}

export default function AuftragsboersePage() {
  const [tab, setTab] = useState<Tab>("find");

  const [orders, setOrders] = useState<PartnerOrder[]>([]);
  const [myOrders, setMyOrders] = useState<PartnerOrder[]>([]);

  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [applicationMessages, setApplicationMessages] =
    useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [marketResponse, mineResponse] = await Promise.all([
        fetch("/api/partner-orders", {
          cache: "no-store",
        }),
        fetch("/api/partner-orders/mine", {
          cache: "no-store",
        }),
      ]);

      const marketData = await marketResponse.json();
      const mineData = await mineResponse.json();

      setOrders(
        Array.isArray(marketData?.orders)
          ? marketData.orders
          : Array.isArray(marketData)
            ? marketData
            : [],
      );

      setMyOrders(
        Array.isArray(mineData?.orders)
          ? mineData.orders
          : Array.isArray(mineData)
            ? mineData
            : [],
      );
    } catch (error) {
      console.error(error);
      setMessage("Die Aufträge konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function apply(orderId: string) {
    const applicationMessage =
      applicationMessages[orderId]?.trim() || "";

    setWorking(`apply-${orderId}`);
    setMessage("");

    try {
      const response = await fetch(
        `/api/partner-orders/${orderId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: applicationMessage,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || data?.ok === false) {
        throw new Error(
          data?.error || "Bewerbung konnte nicht gesendet werden.",
        );
      }

      setApplicationMessages((current) => ({
        ...current,
        [orderId]: "",
      }));

      setMessage("Bewerbung erfolgreich gesendet.");
      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Bewerbung konnte nicht gesendet werden.",
      );
    } finally {
      setWorking(null);
    }
  }

  async function selectProvider(
    orderId: string,
    applicationId: string,
  ) {
    const confirmed = window.confirm(
      "Diese Firma für den Auftrag auswählen?",
    );

    if (!confirmed) return;

    setWorking(`select-${applicationId}`);
    setMessage("");

    try {
      const response = await fetch(
        `/api/partner-orders/${orderId}/select`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || data?.ok === false) {
        throw new Error(
          data?.error || "Firma konnte nicht ausgewählt werden.",
        );
      }

      setMessage(
        `Firma ausgewählt. Die Provision beträgt ${money(
          data?.commissionCHF,
        )}.`,
      );

      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Firma konnte nicht ausgewählt werden.",
      );
    } finally {
      setWorking(null);
    }
  }

  async function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const amountCHF = Number(
      String(form.get("partnerAmountCHF") || "0").replace(",", "."),
    );

    setWorking("create");
    setMessage("");

    try {
      const response = await fetch("/api/partner-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: String(form.get("title") || "").trim(),
          category: String(form.get("category") || "").trim(),
          description: String(form.get("description") || "").trim(),

          postalCode: String(form.get("postalCode") || "").trim(),
          city: String(form.get("city") || "").trim(),
          region: String(form.get("region") || "").trim(),

          scheduledAt:
            String(form.get("scheduledAt") || "").trim() || null,

          flexibleDate: form.get("flexibleDate") === "on",

          partnerAmountCHF: amountCHF,
          partnerAmountCents: Math.round(amountCHF * 100),

          customerName: String(
            form.get("customerName") || "",
          ).trim(),

          customerEmail: String(
            form.get("customerEmail") || "",
          ).trim(),

          customerPhone: String(
            form.get("customerPhone") || "",
          ).trim(),

          customerStreet: String(
            form.get("customerStreet") || "",
          ).trim(),

          customerPostalCode: String(
            form.get("customerPostalCode") || "",
          ).trim(),

          customerCity: String(
            form.get("customerCity") || "",
          ).trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.ok === false) {
        throw new Error(
          data?.error || "Auftrag konnte nicht erstellt werden.",
        );
      }

      formElement.reset();

      setMessage(
        "Auftrag wurde erfolgreich in der Auftragsbörse veröffentlicht.",
      );

      await loadData();
      setTab("mine");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Auftrag konnte nicht erstellt werden.",
      );
    } finally {
      setWorking(null);
    }
  }


  async function deleteOrder(orderId: string) {
    const confirmed = window.confirm(
      "Diesen Auftrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
    );

    if (!confirmed) return;

    setWorking(`delete-${orderId}`);
    setMessage("");

    try {
      const response = await fetch(`/api/partner-orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || "Auftrag konnte nicht gelöscht werden.");
      }

      setMessage("Auftrag wurde erfolgreich gelöscht.");
      await loadData();
      setTab("mine");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Auftrag konnte nicht gelöscht werden."
      );
    } finally {
      setWorking(null);
    }
  }

  async function duplicateOrder(order: any) {
    setWorking(`duplicate-${order.id}`);
    setMessage("");

    try {
      const response = await fetch("/api/partner-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: order.title,
          category: order.category,
          description: order.description || "Duplizierter Auftrag",
          postalCode: order.postalCode || "",
          city: order.city || "",
          region: order.region || "",
          scheduledAt: order.scheduledAt || null,
          flexibleDate: Boolean(order.flexibleDate),
          partnerAmountCHF: Number(order.partnerAmountCHF || 0),
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          customerStreet: "",
          customerPostalCode: "",
          customerCity: "",
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || "Auftrag konnte nicht dupliziert werden.");
      }

      setMessage("Auftrag wurde dupliziert.");
      await loadData();
      setTab("mine");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Auftrag konnte nicht dupliziert werden."
      );
    } finally {
      setWorking(null);
    }
  }



  async function editOrder(order: any) {
    if (order.status !== "OPEN") {
      setMessage("Nur offene Aufträge können bearbeitet werden.");
      return;
    }

    const title = window.prompt(
      "Titel des Auftrags:",
      order.title || ""
    );

    if (title === null) return;

    const postalCode = window.prompt(
      "PLZ:",
      order.postalCode || ""
    );

    if (postalCode === null) return;

    const city = window.prompt(
      "Ort:",
      order.city || ""
    );

    if (city === null) return;

    const amountInput = window.prompt(
      "Betrag für Partnerfirma in CHF:",
      String(order.partnerAmountCHF || "")
    );

    if (amountInput === null) return;

    const amount = Number(
      amountInput
        .replace(/CHF/gi, "")
        .replace(/['’\s]/g, "")
        .replace(",", ".")
    );

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Bitte einen gültigen Betrag eingeben.");
      return;
    }

    setWorking(`edit-${order.id}`);
    setMessage("");

    try {
      const response = await fetch(
        `/api/partner-orders/${order.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            postalCode: postalCode.trim(),
            city: city.trim(),
            partnerAmountCHF: amount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data?.ok === false) {
        throw new Error(
          data?.error || "Auftrag konnte nicht bearbeitet werden."
        );
      }

      setMessage("Auftrag wurde erfolgreich aktualisiert.");
      await loadData();
      setTab("mine");

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Auftrag konnte nicht bearbeitet werden."
      );
    } finally {
      setWorking(null);
    }
  }


  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#13213f_0%,_#07101f_38%,_#040914_100%)] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#111b31] via-[#10152b] to-[#241142] p-7 shadow-2xl sm:p-10">
          <div className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Auftrago B2B Marketplace
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Auftragsbörse
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Vergib eigene Aufträge an geprüfte Firmen oder übernimm
            passende Aufträge anderer Anbieter. Kundendaten werden erst
            nach erfolgreicher Provisionszahlung freigeschaltet.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold">
              12 % Vermittlungsprovision
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold">
              Mindestprovision CHF 25.–
            </div>

            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
              Kundendaten geschützt
            </div>
          </div>
        </section>

        <div className="mb-7 grid grid-cols-1 gap-3 rounded-[24px] border border-white/10 bg-white/[0.035] p-2 sm:grid-cols-3">
          <TabButton
            active={tab === "find"}
            onClick={() => setTab("find")}
            icon="🔎"
            title="Aufträge finden"
          />

          <TabButton
            active={tab === "mine"}
            onClick={() => setTab("mine")}
            icon="📋"
            title="Meine Aufträge"
          />

          <TabButton
            active={tab === "create"}
            onClick={() => setTab("create")}
            icon="➕"
            title="Auftrag einstellen"
          />
        </div>

        {message ? (
          <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm font-bold text-cyan-100">
            {message}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-10 text-center text-slate-300">
            Auftragsbörse wird geladen…
          </div>
        ) : null}

        {!loading && tab === "find" ? (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  Verfügbare Aufträge
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Bewirb dich kostenlos auf passende Firmenaufträge.
                </p>
              </div>

              <div className="text-sm font-bold text-slate-400">
                {orders.length} Aufträge
              </div>
            </div>

            {orders.length === 0 ? (
              <EmptyState text="Aktuell sind keine offenen Aufträge verfügbar." />
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {orders.map((order) => {
                  const amount =
                    order.partnerAmountCHF ??
                    (order.partnerAmountCents ?? 0) / 100;

                  return (
                    <article
                      key={order.id}
                      className="rounded-[28px] border border-white/10 bg-[#0d1728] p-6 shadow-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                            {order.category}
                          </div>

                          <h3 className="text-xl font-black">
                            {order.title}
                          </h3>
                        </div>

                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                          {statusLabel(order.status)}
                        </span>
                      </div>

                      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-300">
                        {order.description}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Info label="Auftragswert" value={money(amount)} />
                        <Info
                          label="Termin"
                          value={
                            order.flexibleDate
                              ? "Flexibel"
                              : dateLabel(order.scheduledAt)
                          }
                        />
                        <Info
                          label="Ort"
                          value={[
                            order.postalCode,
                            order.city,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        />
                        <Info
                          label="Region"
                          value={order.region || "Schweiz"}
                        />
                      </div>

                      <div className="mt-6 border-t border-white/10 pt-5">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Nachricht an Auftraggeber
                        </label>

                        <textarea
                          value={applicationMessages[order.id] || ""}
                          onChange={(event) =>
                            setApplicationMessages((current) => ({
                              ...current,
                              [order.id]: event.target.value,
                            }))
                          }
                          placeholder="Kurz vorstellen, Verfügbarkeit bestätigen…"
                          rows={3}
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
                        />

                        <button
                          type="button"
                          disabled={working === `apply-${order.id}`}
                          onClick={() => void apply(order.id)}
                          className="mt-3 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-5 py-3.5 text-sm font-black text-white transition hover:scale-[1.01] disabled:opacity-50"
                        >
                          {working === `apply-${order.id}`
                            ? "Wird gesendet…"
                            : "Auf Auftrag bewerben"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ) : null}

        {!loading && tab === "mine" ? (
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-black">Meine Aufträge</h2>
              <p className="mt-1 text-sm text-slate-400">
                Bewerber verwalten und eine Partnerfirma auswählen.
              </p>
            </div>

            {myOrders.length === 0 ? (
              <EmptyState text="Du hast noch keine Firmenaufträge eingestellt." />
            ) : (
              <div className="space-y-6">
                {myOrders.map((order) => {
                  const amount =
                    order.partnerAmountCHF ??
                    (order.partnerAmountCents ?? 0) / 100;

                  const commission =
                    order.commissionCHF ??
                    (order.commissionCents ?? 0) / 100;

                  return (
                    <article
                      key={order.id}
                      className="rounded-[30px] border border-white/10 bg-[#0d1728] p-6 sm:p-7"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row">
                        <div>
                          <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                            {order.category}
                          </div>

                          <h3 className="mt-2 text-2xl font-black">
                            {order.title}
                          </h3>

                          <p className="mt-2 text-sm text-slate-400">
                            {[order.postalCode, order.city]
                              .filter(Boolean)
                              .join(" ")}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-start gap-2">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black">
                            {statusLabel(order.status)}
                          </span>

                          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-black text-violet-200">
                            {order.applicationCount ??
                              order.applications?.length ??
                              0}{" "}
                            Bewerber
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <Info label="Partnerbetrag" value={money(amount)} />
                        <Info
                          label="Provision"
                          value={
                            commission > 0
                              ? money(commission)
                              : "12 %"
                          }
                        />
                        <Info
                          label="Termin"
                          value={
                            order.flexibleDate
                              ? "Flexibel"
                              : dateLabel(order.scheduledAt)
                          }
                        />
                      </div>

                      {order.selectedProvider ? (
                        <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                          <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                            Ausgewählte Firma
                          </div>

                          <div className="mt-1 font-black">
                            {order.selectedProvider.companyName ||
                              order.selectedProvider.contactName ||
                              "Partnerfirma"}
                          </div>

                          {order.status === "PAYMENT_PENDING" ? (
                            <div className="mt-1 text-sm text-amber-100/80">
                              Die Partnerfirma muss zuerst die Provision
                              bezahlen.
                            </div>
                          ) : null}

                          {order.status === "UNLOCKED" ? (
                            <div className="mt-1 text-sm font-bold text-emerald-300">
                              ✓ Provision bezahlt – Kundendaten wurden
                              freigeschaltet.
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                  {order.status === "OPEN" ? (
                    <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => void editOrder(order)}
                        disabled={working === `edit-${order.id}`}
                        className="group flex items-center justify-center gap-2 rounded-[16px] border border-slate-600/70 bg-[#111b2e] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-cyan-400/35 hover:bg-[#152239] disabled:opacity-50"
                      
      style={{
        background: "#101a2b",
        borderColor: "rgba(148,163,184,.24)",
        color: "#e2e8f0",
      }}
    >
                        <span className="text-base">✏️</span>
                        {working === `edit-${order.id}`
                          ? "Speichern..."
                          : "Bearbeiten"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void duplicateOrder(order)}
                        disabled={working === `duplicate-${order.id}`}
                        className="group flex items-center justify-center gap-2 rounded-[16px] border border-slate-600/70 bg-[#111b2e] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-violet-400/35 hover:bg-[#171f36] disabled:opacity-50"
                      
      style={{
        background: "#101a2b",
        borderColor: "rgba(148,163,184,.24)",
        color: "#e2e8f0",
      }}
    >
                        <span className="text-base">⧉</span>
                        {working === `duplicate-${order.id}`
                          ? "Dupliziere..."
                          : "Duplizieren"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteOrder(order.id)}
                        disabled={working === `delete-${order.id}`}
                        className="group flex items-center justify-center gap-2 rounded-[16px] border border-red-400/35 bg-[#211319] px-4 py-3 text-sm font-black text-red-300 transition hover:border-red-400/60 hover:bg-[#2b171f] disabled:opacity-50"
                      
      style={{
        background: "rgba(127,29,29,.16)",
        borderColor: "rgba(248,113,113,.42)",
        color: "#fca5a5",
      }}
    >
                        <span className="text-base">🗑</span>
                        {working === `delete-${order.id}`
                          ? "Lösche..."
                          : "Löschen"}
                      </button>
                    </div>
                  ) : null}



                      <div className="mt-6">
                        <h4 className="font-black">
                          Bewerbungen
                        </h4>

                        {!order.applications?.length ? (
                          <div className="mt-3 rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-500">
                            Noch keine Bewerbungen eingegangen.
                          </div>
                        ) : (
                          <div className="mt-3 space-y-3">
                            {order.applications.map((application) => (
                              <div
                                key={application.id}
                                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/15 p-4 md:flex-row md:items-center md:justify-between"
                              >
                                <div>
                                  <div className="font-black">
                                    {application.provider.companyName ||
                                      application.provider.contactName ||
                                      "Anbieter"}
                                  </div>

                                  <div className="mt-1 text-xs text-slate-500">
                                    {[
                                      application.provider.region,
                                      application.provider.city,
                                    ]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </div>

                                  {application.message ? (
                                    <p className="mt-2 text-sm text-slate-300">
                                      {application.message}
                                    </p>
                                  ) : null}
                                </div>

                                {order.status === "OPEN" ? (
                                  <button
                                    type="button"
                                    disabled={
                                      working ===
                                      `select-${application.id}`
                                    }
                                    onClick={() =>
                                      void selectProvider(
                                        order.id,
                                        application.id,
                                      )
                                    }
                                    className="shrink-0 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-50"
                                  >
                                    {working ===
                                    `select-${application.id}`
                                      ? "Wird gewählt…"
                                      : "Firma auswählen"}
                                  </button>
                                ) : application.status === "ACCEPTED" ? (
                                  <span className="text-sm font-black text-emerald-300">
                                    ✓ Ausgewählt
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ) : null}

        {!loading && tab === "create" ? (
          <section className="mx-auto max-w-[1400px]">
            <div className="mb-5">
              <h2 className="text-2xl font-black">
                Auftrag einstellen
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Der Partnerbetrag ist der Betrag, den die ausführende
                Firma für den Auftrag erhält.
              </p>
            </div>

            

<form
  onSubmit={createOrder}
  className="relative overflow-hidden rounded-[32px] border border-slate-700/60 bg-[#081120] shadow-[0_35px_100px_rgba(0,0,0,.45)]"
>
  {/* HEADER */}
  <div className="relative overflow-hidden border-b border-white/[0.07] px-6 py-7 sm:px-8 lg:px-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,.12),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(124,58,237,.14),transparent_40%)]" />

    <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-2 text-[11px] font-black uppercase tracking-[.28em] text-cyan-300">
          AUFTRAG ERSTELLEN
        </div>

        <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          In wenigen Klicks zum passenden Partner
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Leistung auswählen, Termin und Vergütung festlegen und Auftrag veröffentlichen.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-lg">
          🔒
        </div>

        <div>
          <div className="text-sm font-black text-emerald-200">
            Kundendaten geschützt
          </div>
          <div className="text-xs text-emerald-200/60">
            Freigabe erst nach Provisionszahlung
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_350px]">

    {/* LINKER FORMULARBEREICH */}
    <div className="space-y-9 p-6 sm:p-8 lg:p-10">

      {/* SCHRITT 1 */}
      <section>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-sm font-black text-cyan-300">
            01
          </div>

          <div>
            <h4 className="text-lg font-black text-white">
              Welche Arbeit soll ausgeführt werden?
            </h4>
            <p className="text-sm text-slate-500">
              Eine Leistung auswählen.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {QUICK_CATEGORIES.map(([label, icon]) => (
            <label
              key={label}
              className="group cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                value={label}
                required
                className="peer sr-only"
              />

              <div className="relative min-h-[105px] rounded-[18px] border border-slate-700/70 bg-[#0b1628] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-[#0d1b30] peer-checked:border-cyan-400/70 peer-checked:bg-[linear-gradient(145deg,rgba(8,145,178,.15),rgba(79,70,229,.13))] peer-checked:shadow-[0_0_0_1px_rgba(34,211,238,.15),0_12px_35px_rgba(0,0,0,.22)]">
                <div className="absolute right-3 top-3 hidden h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-black text-[#06111f] peer-checked:flex">
                  ✓
                </div>

                <div className="text-2xl">
                  {icon}
                </div>

                <div className="mt-3 text-sm font-black leading-tight text-slate-200 group-hover:text-white">
                  {label}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <label>
            <span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-slate-500">
              Auftragstitel
            </span>

            <input
              name="title"
              required
              placeholder="z.B. Umzugsreinigung 4.5-Zimmer"
              className="h-14 w-full rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 text-sm font-bold text-white outline-none transition placeholder:font-medium placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/[0.06]"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-slate-500">
              Beschreibung
            </span>

            <input
              name="description"
              required
              placeholder="z.B. Wohnung komplett reinigen inkl. Fenster"
              className="h-14 w-full rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 text-sm font-bold text-white outline-none transition placeholder:font-medium placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/[0.06]"
            />
          </label>
        </div>
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* SCHRITT 2 */}
      <section>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.08] text-sm font-black text-blue-300">
            02
          </div>

          <div>
            <h4 className="text-lg font-black text-white">
              Wo und wann?
            </h4>
            <p className="text-sm text-slate-500">
              Einsatzort und Termin festlegen.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label>
            <span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-slate-500">
              PLZ
            </span>

            <input
              name="postalCode"
              inputMode="numeric"
              placeholder="5507"
              className="h-14 w-full rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/[0.06]"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-slate-500">
              Ort
            </span>

            <input
              name="city"
              placeholder="Mellingen"
              className="h-14 w-full rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-400/[0.06]"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-slate-500">
              Kanton
            </span>

            <select
              name="region"
              defaultValue="AG"
              className="h-14 w-full rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none focus:border-blue-400/60"
            >
              {QUICK_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-slate-500">
              Ausführung
            </span>

            <input
              name="scheduledAt"
              type="date"
              className="h-14 w-full rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none focus:border-blue-400/60"
            />
          </label>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-4 rounded-[16px] border border-slate-700/60 bg-white/[0.02] px-4 py-4 transition hover:bg-white/[0.035]">
          <input
            type="checkbox"
            name="flexibleDate"
            className="h-5 w-5 accent-cyan-400"
          />

          <div>
            <div className="text-sm font-black text-white">
              Termin ist flexibel
            </div>

            <div className="mt-0.5 text-xs text-slate-500">
              Die Partnerfirma darf einen passenden Termin vorschlagen.
            </div>
          </div>
        </label>
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* SCHRITT 3 */}
      <section>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/[0.08] text-sm font-black text-violet-300">
            03
          </div>

          <div>
            <h4 className="text-lg font-black text-white">
              Vergütung festlegen
            </h4>

            <p className="text-sm text-slate-500">
              Betrag, den die ausführende Firma erhält.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 lg:grid-cols-8">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={(event) => {
                const form = event.currentTarget.closest("form");
                const input = form?.querySelector<HTMLInputElement>(
                  'input[name="partnerAmountCHF"]'
                );

                if (input) {
                  input.value = String(amount);
                  input.dispatchEvent(
                    new Event("input", { bubbles: true })
                  );
                }
              }}
              className="rounded-[14px] border border-slate-700/70 bg-[#0b1628] px-2 py-3 text-xs font-black text-slate-300 transition hover:border-violet-400/50 hover:bg-violet-400/[0.08] hover:text-white"
            >
              CHF {amount.toLocaleString("de-CH")}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-slate-500">
            Eigener Betrag
          </span>

          <div className="flex h-14 max-w-md overflow-hidden rounded-[16px] border border-slate-700/70 bg-[#07111f] focus-within:border-violet-400/60 focus-within:ring-4 focus-within:ring-violet-400/[0.06]">
            <div className="flex items-center border-r border-slate-700/70 px-4 text-sm font-black text-slate-500">
              CHF
            </div>

            <input
              name="partnerAmountCHF"
              type="number"
              min="1"
              step="0.01"
              required
              placeholder="1500"
              className="min-w-0 flex-1 bg-transparent px-4 font-black text-white outline-none placeholder:text-slate-700"
            />
          </div>
        </label>

        <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-violet-400/15 bg-violet-400/[0.04] px-4 py-3">
          <span>ℹ️</span>

          <p className="text-xs leading-5 text-slate-400">
            Vermittlungsprovision:
            <strong className="ml-1 text-slate-200">
              12 % des Auftragswertes, mindestens CHF 25.–
            </strong>
            Die Provision bezahlt die ausgewählte Partnerfirma.
          </p>
        </div>
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* SCHRITT 4 */}
      <section>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-sm font-black text-emerald-300">
            04
          </div>

          <div>
            <h4 className="text-lg font-black text-white">
              Kundendaten
            </h4>

            <p className="text-sm text-slate-500">
              Werden erst nach erfolgreicher Provision freigeschaltet.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input
            name="customerName"
            placeholder="Name / Firma"
            className="h-14 rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
          />

          <input
            name="customerPhone"
            placeholder="Telefon"
            className="h-14 rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
          />

          <input
            name="customerEmail"
            type="email"
            placeholder="E-Mail"
            className="h-14 rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
          />

          <input
            name="customerStreet"
            placeholder="Strasse / Nr."
            className="h-14 rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
          />

          <input
            name="customerPostalCode"
            placeholder="PLZ"
            className="h-14 rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
          />

          <input
            name="customerCity"
            placeholder="Ort"
            className="h-14 rounded-[16px] border border-slate-700/70 bg-[#07111f] px-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={working === "create"}
        className="group flex h-16 w-full items-center justify-center gap-3 rounded-[18px] border border-cyan-300/20 bg-[linear-gradient(135deg,#0e7490,#2563eb,#5b4fd6)] px-6 text-base font-black text-white shadow-[0_18px_50px_rgba(37,99,235,.25)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50"
      >
        {working === "create"
          ? "Auftrag wird veröffentlicht..."
          : "Auftrag veröffentlichen"}

        <span className="transition group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>

    {/* RECHTE INFOLEISTE */}
    <aside className="border-t border-white/[0.07] bg-[#091426] p-6 xl:border-l xl:border-t-0 xl:p-7">

      <div className="sticky top-6 space-y-5">

        <div>
          <div className="text-[11px] font-black uppercase tracking-[.22em] text-slate-500">
            Ablauf
          </div>

          <h4 className="mt-2 text-xl font-black text-white">
            Schnell zum Auftrag
          </h4>
        </div>

        {[
          ["01", "Auftrag erstellen", "Daten eingeben und veröffentlichen."],
          ["02", "Bewerbungen erhalten", "Interessierte Firmen melden sich."],
          ["03", "Firma auswählen", "Du bestimmst den Partner."],
          ["04", "Kontaktdaten freigeben", "Nach erfolgreicher Provision."],
        ].map(([number, title, description]) => (
          <div
            key={number}
            className="flex gap-3 rounded-[16px] border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-xs font-black text-cyan-300">
              {number}
            </div>

            <div>
              <div className="text-sm font-black text-white">
                {title}
              </div>

              <div className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-[18px] border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              🛡️
            </div>

            <div className="font-black text-emerald-200">
              Sicher vermittelt
            </div>
          </div>

          <p className="mt-3 text-xs leading-5 text-emerald-100/60">
            Telefonnummer, E-Mail und Adresse bleiben geschützt und werden erst nach erfolgreicher Provisionszahlung sichtbar.
          </p>
        </div>

        <div className="rounded-[18px] border border-white/[0.07] bg-black/10 p-5">
          <div className="text-xs font-black uppercase tracking-[.15em] text-slate-500">
            Vermittlung
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-black text-white">
                12 %
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Provision
              </div>
            </div>

            <div className="text-right">
              <div className="font-black text-white">
                CHF 25.–
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Mindestprovision
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</form>


          </section>
        ) : null}
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[18px] border px-5 py-4 text-left transition-all duration-200 ${
        active
          ? "border-cyan-400/30 bg-[#101a2c] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_10px_30px_rgba(0,0,0,.20)]"
          : "border-white/[0.06] bg-[#0a1322] text-slate-400 hover:border-white/[0.12] hover:bg-[#0e1828] hover:text-white"
      }`}
    >
      {active ? (
        <>
          <div className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-cyan-400" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(34,211,238,.07),transparent_35%)]" />
        </>
      ) : null}

      <div className="relative flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg transition ${
            active
              ? "border-cyan-400/15 bg-cyan-400/[0.07]"
              : "border-white/[0.05] bg-white/[0.025]"
          }`}
        >
          {icon}
        </div>

        <div>
          <div className="text-sm font-black sm:text-base">
            {title}
          </div>

          <div className="mt-0.5 text-[11px] font-medium text-slate-600">
            {title === "Aufträge finden"
              ? "Passende Firmenaufträge entdecken"
              : title === "Meine Aufträge"
                ? "Verwalten, bearbeiten & vergeben"
                : "Neuen Auftrag veröffentlichen"}
          </div>
        </div>
      </div>
    </button>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-black text-slate-100">
        {value || "–"}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">
      <div className="text-4xl">🤝</div>
      <div className="mt-4 font-black">{text}</div>
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-8">
      <legend className="mb-4 text-lg font-black">{title}</legend>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <input
        {...props}
        className="h-14 w-full rounded-2xl border border-white/10 bg-[#091426] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
      />
    </label>
  );
}

function TextArea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <textarea
        {...props}
        rows={5}
        className="w-full rounded-2xl border border-white/10 bg-[#091426] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
      />
    </label>
  );
}
