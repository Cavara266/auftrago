"use client";

import {
  useMemo,
  useState,
} from "react";

type LeadStatus =
  | "OPEN"
  | "CONTACTED"
  | "APPOINTMENT_SET"
  | "OFFER_SENT"
  | "WON"
  | "LOST"
  | "NO_OFFER";

type Note = {
  id: string;
  content: string;
  createdAt: string;
};

type Message = {
  id: string;
  sender: string;
  message: string;
  createdAt: string;
};

type Activity = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
};

type Purchase = {
  id: string;
  status: LeadStatus;
  price: number;
  createdAt: string;
  lead: {
    id: string;
    title: string;
    description: string;
    name: string;
    email: string;
    phone: string;
    region: string;
    category: string;
    price: number;
    createdAt: string;
  };
  notes: Note[];
  messages: Message[];
  activities: Activity[];
};

type Tab =
  | "overview"
  | "notes"
  | "chat"
  | "activities";

const statusOptions: {
  value: LeadStatus;
  label: string;
}[] = [
  {
    value: "OPEN",
    label: "Offene Anfrage",
  },
  {
    value: "CONTACTED",
    label: "Kontaktiert",
  },
  {
    value: "APPOINTMENT_SET",
    label: "Termin abgemacht",
  },
  {
    value: "OFFER_SENT",
    label: "Offerte geschickt",
  },
  {
    value: "WON",
    label: "Auftrag gewonnen",
  },
  {
    value: "LOST",
    label: "Auftrag verloren",
  },
  {
    value: "NO_OFFER",
    label: "Kein Angebot gemacht",
  },
];

const statusLabels: Record<
  LeadStatus,
  string
> = {
  OPEN: "Offene Anfrage",
  CONTACTED: "Kontaktiert",
  APPOINTMENT_SET: "Termin vereinbart",
  OFFER_SENT: "Offerte versendet",
  WON: "Auftrag gewonnen",
  LOST: "Auftrag verloren",
  NO_OFFER: "Kein Angebot",
};

const statusProgress: Record<
  LeadStatus,
  number
> = {
  OPEN: 15,
  CONTACTED: 35,
  APPOINTMENT_SET: 58,
  OFFER_SENT: 78,
  WON: 100,
  LOST: 100,
  NO_OFFER: 100,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "de-CH",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat(
    "de-CH",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function getNextStep(
  status: LeadStatus
) {
  switch (status) {
    case "OPEN":
      return "Kunde möglichst schnell kontaktieren";

    case "CONTACTED":
      return "Termin oder Besichtigung vereinbaren";

    case "APPOINTMENT_SET":
      return "Offerte vorbereiten und senden";

    case "OFFER_SENT":
      return "Offerte telefonisch nachfassen";

    case "WON":
      return "Ausführung und Termin planen";

    case "LOST":
      return "Verlustgrund dokumentieren";

    case "NO_OFFER":
      return "Entscheidung intern prüfen";
  }
}

function getWhatsAppUrl(
  phone: string,
  customerName: string,
  title: string
) {
  const cleanPhone = phone.replace(
    /\D/g,
    ""
  );

  const message = encodeURIComponent(
    `Guten Tag ${customerName}\n\nVielen Dank für Ihre Anfrage "${title}". Gerne würden wir die Details kurz mit Ihnen besprechen.\n\nFreundliche Grüsse`
  );

  return `https://wa.me/${cleanPhone}?text=${message}`;
}

export default function LeadWorkspace({
  purchase,
}: {
  purchase: Purchase;
}) {
  const [activeTab, setActiveTab] =
    useState<Tab>("overview");

  const [status, setStatus] =
    useState<LeadStatus>(
      purchase.status
    );

  const [notes, setNotes] =
    useState<Note[]>(purchase.notes);

  const [messages, setMessages] =
    useState<Message[]>(
      purchase.messages
    );

  const [activities, setActivities] =
    useState<Activity[]>(
      purchase.activities
    );

  const [noteText, setNoteText] =
    useState("");

  const [
    messageText,
    setMessageText,
  ] = useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const progress =
    statusProgress[status];

  const leadScore = useMemo(() => {
    let score = 62;

    if (purchase.lead.phone) {
      score += 8;
    }

    if (purchase.lead.email) {
      score += 7;
    }

    if (
      purchase.lead.description
        .trim()
        .length > 40
    ) {
      score += 8;
    }

    if (status === "CONTACTED") {
      score += 4;
    }

    if (
      status ===
      "APPOINTMENT_SET"
    ) {
      score += 8;
    }

    if (
      status === "OFFER_SENT"
    ) {
      score += 12;
    }

    return Math.min(score, 96);
  }, [
    purchase.lead.description,
    purchase.lead.email,
    purchase.lead.phone,
    status,
  ]);

  async function refreshActivities() {
    const response = await fetch(
      `/api/portal/lead-purchases/${purchase.id}/activities`
    );

    const data =
      await response.json();

    if (data.ok) {
      setActivities(
        data.activities
      );
    }
  }

  async function updateStatus(
    nextStatus: LeadStatus
  ) {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/portal/lead-purchases/${purchase.id}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data.error ||
            "Status konnte nicht geändert werden."
        );

        return;
      }

      setStatus(data.status);
      await refreshActivities();
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Technischer Fehler beim Speichern."
      );
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    const content =
      noteText.trim();

    if (!content) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/portal/lead-purchases/${purchase.id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            content,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data.error ||
            "Notiz konnte nicht gespeichert werden."
        );

        return;
      }

      setNotes((currentNotes) => [
        data.note,
        ...currentNotes,
      ]);

      setNoteText("");
      await refreshActivities();
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Technischer Fehler beim Speichern."
      );
    } finally {
      setSaving(false);
    }
  }

  async function sendMessage() {
    const message =
      messageText.trim();

    if (!message) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/portal/lead-purchases/${purchase.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data.error ||
            "Nachricht konnte nicht gespeichert werden."
        );

        return;
      }

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          data.message,
        ]
      );

      setMessageText("");
      await refreshActivities();
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Technischer Fehler beim Senden."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="lead-workspace">
      <section className="lead-workspace__command">
        <div className="lead-workspace__customer">
          <div className="lead-workspace__avatar">
            {getInitials(
              purchase.lead.name
            )}
          </div>

          <div className="lead-workspace__customer-copy">
            <div className="lead-workspace__badges">
              <span>
                {
                  purchase.lead
                    .category
                }
              </span>

              <span>
                {
                  purchase.lead
                    .region
                }
              </span>

              <span>
                {purchase.price} Credits
              </span>
            </div>

            <h2>
              {purchase.lead.name}
            </h2>

            <p>
              Kunde für{" "}
              <strong>
                {purchase.lead.title}
              </strong>
            </p>
          </div>
        </div>

        <div className="lead-workspace__status-panel">
          <div className="lead-workspace__status-heading">
            <span>
              AKTUELLER STATUS
            </span>

            <strong>
              {statusLabels[status]}
            </strong>
          </div>

          <div className="lead-workspace__select-shell">
            <select
              value={status}
              onChange={(event) =>
                updateStatus(
                  event.target
                    .value as LeadStatus
                )
              }
              disabled={saving}
              aria-label="Lead-Status ändern"
            >
              {statusOptions.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>

            <span>⌄</span>
          </div>
        </div>

        <div className="lead-workspace__progress">
          <div>
            <span>
              Verkaufsfortschritt
            </span>

            <strong>
              {progress} %
            </strong>
          </div>

          <div className="lead-workspace__progress-track">
            <span
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="lead-workspace__actions">
        <a
          href={`tel:${purchase.lead.phone}`}
          className="lead-workspace__action lead-workspace__action--call"
        >
          <span>☎</span>

          <div>
            <strong>
              Jetzt anrufen
            </strong>

            <small>
              {
                purchase.lead
                  .phone
              }
            </small>
          </div>
        </a>

        <a
          href={getWhatsAppUrl(
            purchase.lead.phone,
            purchase.lead.name,
            purchase.lead.title
          )}
          target="_blank"
          rel="noreferrer"
          className="lead-workspace__action lead-workspace__action--whatsapp"
        >
          <span>◉</span>

          <div>
            <strong>
              WhatsApp
            </strong>

            <small>
              Nachricht öffnen
            </small>
          </div>
        </a>

        <a
          href={`mailto:${purchase.lead.email}?subject=${encodeURIComponent(
            purchase.lead.title
          )}`}
          className="lead-workspace__action lead-workspace__action--mail"
        >
          <span>✉</span>

          <div>
            <strong>
              E-Mail
            </strong>

            <small>
              {
                purchase.lead
                  .email
              }
            </small>
          </div>
        </a>

        <button
          type="button"
          onClick={() =>
            setActiveTab("notes")
          }
          className="lead-workspace__action lead-workspace__action--note"
        >
          <span>＋</span>

          <div>
            <strong>
              Notiz erstellen
            </strong>

            <small>
              Intern dokumentieren
            </small>
          </div>
        </button>
      </section>

      {error ? (
        <div className="lead-workspace__error">
          {error}
        </div>
      ) : null}

      <nav className="lead-workspace__tabs">
        <button
          type="button"
          onClick={() =>
            setActiveTab("overview")
          }
          className={
            activeTab === "overview"
              ? "lead-workspace__tab lead-workspace__tab--active"
              : "lead-workspace__tab"
          }
        >
          <span>⌂</span>
          Übersicht
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("notes")
          }
          className={
            activeTab === "notes"
              ? "lead-workspace__tab lead-workspace__tab--active"
              : "lead-workspace__tab"
          }
        >
          <span>✎</span>
          Notizen
          <b>{notes.length}</b>
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("chat")
          }
          className={
            activeTab === "chat"
              ? "lead-workspace__tab lead-workspace__tab--active"
              : "lead-workspace__tab"
          }
        >
          <span>◌</span>
          Kommunikation
          <b>
            {messages.length}
          </b>
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "activities"
            )
          }
          className={
            activeTab ===
            "activities"
              ? "lead-workspace__tab lead-workspace__tab--active"
              : "lead-workspace__tab"
          }
        >
          <span>↗</span>
          Aktivitäten
          <b>
            {activities.length}
          </b>
        </button>
      </nav>

      {activeTab === "overview" ? (
        <section className="lead-workspace__overview">
          <div className="lead-workspace__main-column">
            <article className="lead-workspace__card lead-workspace__request">
              <header>
                <div>
                  <span className="lead-workspace__eyebrow">
                    KUNDENANFRAGE
                  </span>

                  <h3>
                    {
                      purchase.lead
                        .title
                    }
                  </h3>
                </div>

                <span className="lead-workspace__request-date">
                  Eingegangen am{" "}
                  {formatShortDate(
                    purchase.lead
                      .createdAt
                  )}
                </span>
              </header>

              <div className="lead-workspace__description">
                {purchase.lead
                  .description ? (
                  <p>
                    {
                      purchase.lead
                        .description
                    }
                  </p>
                ) : (
                  <p>
                    Keine weitere
                    Beschreibung
                    vorhanden.
                  </p>
                )}
              </div>
            </article>

            <article className="lead-workspace__card">
              <header>
                <div>
                  <span className="lead-workspace__eyebrow">
                    KUNDENDATEN
                  </span>

                  <h3>
                    Kontaktinformationen
                  </h3>
                </div>
              </header>

              <div className="lead-workspace__data-grid">
                <div>
                  <span>Name</span>
                  <strong>
                    {
                      purchase.lead
                        .name
                    }
                  </strong>
                </div>

                <div>
                  <span>Telefon</span>
                  <a
                    href={`tel:${purchase.lead.phone}`}
                  >
                    {
                      purchase.lead
                        .phone
                    }
                  </a>
                </div>

                <div>
                  <span>E-Mail</span>
                  <a
                    href={`mailto:${purchase.lead.email}`}
                  >
                    {
                      purchase.lead
                        .email
                    }
                  </a>
                </div>

                <div>
                  <span>Region</span>
                  <strong>
                    {
                      purchase.lead
                        .region
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Dienstleistung
                  </span>
                  <strong>
                    {
                      purchase.lead
                        .category
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Lead gekauft
                  </span>
                  <strong>
                    {formatShortDate(
                      purchase.createdAt
                    )}
                  </strong>
                </div>
              </div>
            </article>
          </div>

          <aside className="lead-workspace__sidebar">
            <article className="lead-workspace__card lead-workspace__score-card">
              <span className="lead-workspace__eyebrow">
                LEAD SCORE
              </span>

              <div className="lead-workspace__score">
                <strong>
                  {leadScore}
                </strong>

                <span>/ 100</span>
              </div>

              <div className="lead-workspace__score-track">
                <span
                  style={{
                    width: `${leadScore}%`,
                  }}
                />
              </div>

              <p>
                {leadScore >= 80
                  ? "Sehr gute Datenqualität und hohe Kontaktchance."
                  : "Solide Anfrage mit vollständigen Kontaktdaten."}
              </p>
            </article>

            <article className="lead-workspace__card lead-workspace__next-step">
              <span className="lead-workspace__eyebrow">
                EMPFOHLENER NÄCHSTER
                SCHRITT
              </span>

              <h3>
                {getNextStep(
                  status
                )}
              </h3>

              <p>
                Schnelle Reaktionen
                erhöhen in der Regel
                die Chance auf einen
                erfolgreichen Abschluss.
              </p>
            </article>

            <article className="lead-workspace__card lead-workspace__summary">
              <span className="lead-workspace__eyebrow">
                CRM ÜBERSICHT
              </span>

              <div>
                <span>Notizen</span>
                <strong>
                  {notes.length}
                </strong>
              </div>

              <div>
                <span>
                  Nachrichten
                </span>
                <strong>
                  {
                    messages.length
                  }
                </strong>
              </div>

              <div>
                <span>
                  Aktivitäten
                </span>
                <strong>
                  {
                    activities.length
                  }
                </strong>
              </div>

              <div>
                <span>
                  Kaufpreis
                </span>
                <strong>
                  {purchase.price}{" "}
                  Credits
                </strong>
              </div>
            </article>
          </aside>
        </section>
      ) : null}

      {activeTab === "notes" ? (
        <section className="lead-workspace__tab-panel">
          <header className="lead-workspace__panel-header">
            <div>
              <span className="lead-workspace__eyebrow">
                INTERNE NOTIZEN
              </span>

              <h3>
                Wissen und Absprachen
                festhalten
              </h3>

              <p>
                Diese Notizen sind nur
                für dein Unternehmen
                sichtbar.
              </p>
            </div>

            <span>
              {notes.length}{" "}
              {notes.length === 1
                ? "Notiz"
                : "Notizen"}
            </span>
          </header>

          <div className="lead-workspace__composer">
            <textarea
              value={noteText}
              onChange={(event) =>
                setNoteText(
                  event.target.value
                )
              }
              placeholder="Zum Beispiel: Kunde möchte morgen um 14:00 Uhr angerufen werden..."
              rows={5}
            />

            <div>
              <small>
                Interne Notiz zum Lead
              </small>

              <button
                type="button"
                onClick={addNote}
                disabled={
                  saving ||
                  !noteText.trim()
                }
              >
                {saving
                  ? "Speichern..."
                  : "Notiz speichern"}
              </button>
            </div>
          </div>

          <div className="lead-workspace__note-grid">
            {notes.length > 0 ? (
              notes.map(
                (note) => (
                  <article
                    key={note.id}
                    className="lead-workspace__note"
                  >
                    <div>
                      <span>✎</span>

                      <small>
                        {formatDate(
                          note.createdAt
                        )}
                      </small>
                    </div>

                    <p>
                      {note.content}
                    </p>
                  </article>
                )
              )
            ) : (
              <div className="lead-workspace__empty">
                <span>✎</span>

                <h4>
                  Noch keine Notizen
                </h4>

                <p>
                  Speichere die erste
                  Information zu diesem
                  Kunden.
                </p>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {activeTab === "chat" ? (
        <section className="lead-workspace__tab-panel">
          <header className="lead-workspace__panel-header">
            <div>
              <span className="lead-workspace__eyebrow">
                KOMMUNIKATION
              </span>

              <h3>
                Nachrichtenverlauf
              </h3>

              <p>
                Portalinterne Nachrichten
                und Gesprächsnotizen
                zentral speichern.
              </p>
            </div>
          </header>

          <div className="lead-workspace__messages">
            {messages.length > 0 ? (
              messages.map(
                (item) => (
                  <article
                    key={item.id}
                    className={
                      item.sender ===
                      "provider"
                        ? "lead-workspace__message lead-workspace__message--provider"
                        : "lead-workspace__message"
                    }
                  >
                    <div>
                      <strong>
                        {item.sender ===
                        "provider"
                          ? "Du"
                          : purchase
                              .lead
                              .name}
                      </strong>

                      <small>
                        {formatDate(
                          item.createdAt
                        )}
                      </small>
                    </div>

                    <p>
                      {item.message}
                    </p>
                  </article>
                )
              )
            ) : (
              <div className="lead-workspace__empty">
                <span>◌</span>

                <h4>
                  Noch keine Nachrichten
                </h4>

                <p>
                  Dokumentiere die erste
                  Kommunikation mit dem
                  Kunden.
                </p>
              </div>
            )}
          </div>

          <div className="lead-workspace__composer">
            <textarea
              value={messageText}
              onChange={(event) =>
                setMessageText(
                  event.target.value
                )
              }
              placeholder="Nachricht oder Gesprächsnotiz schreiben..."
              rows={5}
            />

            <div>
              <small>
                Wird im CRM gespeichert
              </small>

              <button
                type="button"
                onClick={sendMessage}
                disabled={
                  saving ||
                  !messageText.trim()
                }
              >
                {saving
                  ? "Speichern..."
                  : "Nachricht speichern"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab ===
      "activities" ? (
        <section className="lead-workspace__tab-panel">
          <header className="lead-workspace__panel-header">
            <div>
              <span className="lead-workspace__eyebrow">
                CRM TIMELINE
              </span>

              <h3>
                Aktivitäten
              </h3>

              <p>
                Alle Statusänderungen
                und Aktionen chronologisch
                im Überblick.
              </p>
            </div>
          </header>

          <div className="lead-workspace__timeline">
            {activities.length > 0 ? (
              activities.map(
                (
                  activity,
                  index
                ) => (
                  <article
                    key={
                      activity.id
                    }
                  >
                    <div className="lead-workspace__timeline-marker">
                      <span>
                        {index + 1}
                      </span>
                    </div>

                    <div>
                      <small>
                        {activity.type}
                      </small>

                      <strong>
                        {
                          activity.description
                        }
                      </strong>

                      <time>
                        {formatDate(
                          activity.createdAt
                        )}
                      </time>
                    </div>
                  </article>
                )
              )
            ) : (
              <div className="lead-workspace__empty">
                <span>↗</span>

                <h4>
                  Noch keine Aktivitäten
                </h4>

                <p>
                  Änderungen werden hier
                  automatisch dokumentiert.
                </p>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
