"use client";

import { useState } from "react";

type LeadStatus =
  | "OPEN"
  | "CONTACTED"
  | "APPOINTMENT_SET"
  | "OFFER_SENT"
  | "WON"
  | "LOST"
  | "NO_OFFER";

type OfferStatus = "SENT" | "ACCEPTED" | "DECLINED";

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

type Offer = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: OfferStatus;
  pdfUrl: string | null;
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
  offers: Offer[];
};

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "OPEN", label: "Offene Anfrage" },
  { value: "CONTACTED", label: "Kontaktiert" },
  { value: "APPOINTMENT_SET", label: "Termin abgemacht" },
  { value: "OFFER_SENT", label: "Offerte geschickt" },
  { value: "WON", label: "Auftrag gewonnen" },
  { value: "LOST", label: "Auftrag verloren" },
  { value: "NO_OFFER", label: "Kein Angebot gemacht" },
];

const offerStatusLabels: Record<OfferStatus, string> = {
  SENT: "Gesendet",
  ACCEPTED: "Angenommen",
  DECLINED: "Abgelehnt",
};

const offerTemplates = [
  {
    title: "Umzugsreinigung Standard",
    description:
      "Umzugsreinigung inklusive Küche, Bad, Böden, Fenster innen und allgemeiner Endreinigung. Preis nach Besichtigung final.",
    amount: "790",
  },
  {
    title: "Fensterreinigung",
    description:
      "Fensterreinigung inklusive Rahmen, Glasflächen und einfacher Storenreinigung. Preis abhängig von Anzahl und Zugänglichkeit.",
    amount: "290",
  },
  {
    title: "Hauswartung Monatlich",
    description:
      "Regelmässige Hauswartung inklusive Kontrollgang, Treppenhaus, Umgebungskontrolle und Kleinunterhalt nach Absprache.",
    amount: "890",
  },
  {
    title: "Gartenpflege",
    description:
      "Gartenpflege inklusive Rasenmähen, Heckenschnitt, Laubarbeiten und allgemeiner Pflege nach Aufwand.",
    amount: "450",
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(value);
}

export default function LeadWorkspace({ purchase }: { purchase: Purchase }) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "chat" | "offers" | "activities"
  >("overview");

  const [status, setStatus] = useState<LeadStatus>(purchase.status);
  const [notes, setNotes] = useState<Note[]>(purchase.notes);
  const [messages, setMessages] = useState<Message[]>(purchase.messages);
  const [activities, setActivities] = useState<Activity[]>(purchase.activities);
  const [offers, setOffers] = useState<Offer[]>(purchase.offers);

  const [noteText, setNoteText] = useState("");
  const [messageText, setMessageText] = useState("");

  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerAmount, setOfferAmount] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function refreshActivities() {
    const res = await fetch(
      `/api/portal/lead-purchases/${purchase.id}/activities`
    );
    const data = await res.json();

    if (data.ok) {
      setActivities(data.activities);
    }
  }

  async function updateStatus(nextStatus: LeadStatus) {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        `/api/portal/lead-purchases/${purchase.id}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Status konnte nicht geändert werden.");
        return;
      }

      setStatus(data.status);
      await refreshActivities();
    } catch (err) {
      console.error(err);
      setError("Technischer Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    const content = noteText.trim();

    if (!content) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        `/api/portal/lead-purchases/${purchase.id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Notiz konnte nicht gespeichert werden.");
        return;
      }

      setNotes([data.note, ...notes]);
      setNoteText("");
      await refreshActivities();
    } catch (err) {
      console.error(err);
      setError("Technischer Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  }

  async function sendMessage() {
    const message = messageText.trim();

    if (!message) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        `/api/portal/lead-purchases/${purchase.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Nachricht konnte nicht gespeichert werden.");
        return;
      }

      setMessages([...messages, data.message]);
      setMessageText("");
      await refreshActivities();
    } catch (err) {
      console.error(err);
      setError("Technischer Fehler beim Senden.");
    } finally {
      setSaving(false);
    }
  }

  async function createOffer() {
    const title = offerTitle.trim();
    const description = offerDescription.trim();
    const amount = Number(offerAmount);

    if (!title || !amount || amount <= 0) {
      setError("Bitte Titel und gültigen Betrag eingeben.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        `/api/portal/lead-purchases/${purchase.id}/offers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            amount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Offerte konnte nicht erstellt werden.");
        return;
      }

      setOffers([data.offer, ...offers]);
      setOfferTitle("");
      setOfferDescription("");
      setOfferAmount("");
      setStatus("OFFER_SENT");
      await refreshActivities();
    } catch (err) {
      console.error(err);
      setError("Technischer Fehler beim Erstellen der Offerte.");
    } finally {
      setSaving(false);
    }
  }

  function applyTemplate(template: {
    title: string;
    description: string;
    amount: string;
  }) {
    setOfferTitle(template.title);
    setOfferDescription(template.description);
    setOfferAmount(template.amount);
  }

  return (
    <div className="portal-leads-panel">
      <div className="portal-lead-card" style={{ alignItems: "flex-start" }}>
        <div className="portal-lead-left">
          <div className="portal-lead-tags">
            <span>{purchase.lead.category}</span>
            <span>{purchase.lead.region}</span>
            <span>{purchase.price} Credits</span>
          </div>

          <h2>{purchase.lead.name}</h2>

          <div className="portal-lead-meta">
            <span>📞 {purchase.lead.phone}</span>
            <span>✉️ {purchase.lead.email}</span>
            <span>📍 {purchase.lead.region}</span>
          </div>
        </div>

        <div className="portal-lead-right">
          <label style={{ color: "white", fontWeight: 700 }}>
            Status
            <select
              value={status}
              onChange={(event) =>
                updateStatus(event.target.value as LeadStatus)
              }
              disabled={saving}
              style={{
                display: "block",
                marginTop: "10px",
                padding: "12px",
                borderRadius: "12px",
                width: "220px",
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error ? <p className="mega-error">{error}</p> : null}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "24px",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={
            activeTab === "overview" ? "btn btn-primary" : "btn btn-secondary"
          }
        >
          Übersicht
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={
            activeTab === "notes" ? "btn btn-primary" : "btn btn-secondary"
          }
        >
          Notizen
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={
            activeTab === "chat" ? "btn btn-primary" : "btn btn-secondary"
          }
        >
          Chat
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("offers")}
          className={
            activeTab === "offers" ? "btn btn-primary" : "btn btn-secondary"
          }
        >
          Offerten
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("activities")}
          className={
            activeTab === "activities" ? "btn btn-primary" : "btn btn-secondary"
          }
        >
          Aktivitäten
        </button>
      </div>

      {activeTab === "overview" ? (
        <div className="premium-provider-card">
          <span className="eyebrow">Anfrage</span>
          <h2>{purchase.lead.title}</h2>

          <p style={{ whiteSpace: "pre-line" }}>{purchase.lead.description}</p>

          <h3>Kontaktdaten</h3>
          <p>
            <strong>Name:</strong> {purchase.lead.name}
            <br />
            <strong>Telefon:</strong> {purchase.lead.phone}
            <br />
            <strong>E-Mail:</strong> {purchase.lead.email}
            <br />
            <strong>Region:</strong> {purchase.lead.region}
            <br />
            <strong>Kategorie:</strong> {purchase.lead.category}
          </p>
        </div>
      ) : null}

      {activeTab === "notes" ? (
        <div className="premium-provider-card">
          <span className="eyebrow">Interne Notizen</span>
          <h2>Notizen</h2>
          <p>Diese Notizen sind nur für dich sichtbar.</p>

          <textarea
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="Neue Notiz schreiben..."
            rows={4}
            style={{ width: "100%", marginTop: "16px" }}
          />

          <button
            type="button"
            onClick={addNote}
            disabled={saving || !noteText.trim()}
            className="btn btn-primary"
            style={{ marginTop: "12px" }}
          >
            Notiz speichern
          </button>

          <div style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="portal-side-card">
                  <p>{note.content}</p>
                  <small>{formatDate(note.createdAt)}</small>
                </div>
              ))
            ) : (
              <p>Noch keine Notizen vorhanden.</p>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === "chat" ? (
        <div className="premium-provider-card">
          <span className="eyebrow">Chat</span>
          <h2>Nachrichten</h2>
          <p>
            MVP: Nachrichten werden im Portal gespeichert. Kundenantworten
            können später ergänzt werden.
          </p>

          <div style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
            {messages.length > 0 ? (
              messages.map((item) => (
                <div key={item.id} className="portal-side-card">
                  <strong>{item.sender === "provider" ? "Du" : "Kunde"}</strong>
                  <p>{item.message}</p>
                  <small>{formatDate(item.createdAt)}</small>
                </div>
              ))
            ) : (
              <p>Noch keine Nachrichten vorhanden.</p>
            )}
          </div>

          <textarea
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Nachricht schreiben..."
            rows={4}
            style={{ width: "100%", marginTop: "24px" }}
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={saving || !messageText.trim()}
            className="btn btn-primary"
            style={{ marginTop: "12px" }}
          >
            Nachricht speichern
          </button>
        </div>
      ) : null}

      {activeTab === "offers" ? (
        <div className="premium-provider-card">
          <span className="eyebrow">Offerten</span>
          <h2>Offerte erstellen</h2>
          <p>
            Erstelle eine einfache Offerte direkt im Lead. Später können daraus
            automatisch PDF-Offerten und Vorlagen entstehen.
          </p>

          <div
            style={{
              display: "grid",
              gap: "10px",
              marginTop: "18px",
              marginBottom: "18px",
            }}
          >
            <strong>Vorlagen</strong>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {offerTemplates.map((template) => (
                <button
                  key={template.title}
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => applyTemplate(template)}
                >
                  {template.title}
                </button>
              ))}
            </div>
          </div>

          <input
            value={offerTitle}
            onChange={(event) => setOfferTitle(event.target.value)}
            placeholder="Titel der Offerte"
            style={{ width: "100%", marginTop: "12px" }}
          />

          <textarea
            value={offerDescription}
            onChange={(event) => setOfferDescription(event.target.value)}
            placeholder="Beschreibung / Leistungsumfang"
            rows={5}
            style={{ width: "100%", marginTop: "12px" }}
          />

          <input
            value={offerAmount}
            onChange={(event) => setOfferAmount(event.target.value)}
            placeholder="Betrag in CHF"
            type="number"
            min="0"
            step="0.05"
            style={{ width: "100%", marginTop: "12px" }}
          />

          <button
            type="button"
            onClick={createOffer}
            disabled={saving || !offerTitle.trim() || !offerAmount.trim()}
            className="btn btn-primary"
            style={{ marginTop: "12px" }}
          >
            Offerte erstellen
          </button>

          <div style={{ marginTop: "28px", display: "grid", gap: "12px" }}>
            <h3>Erstellte Offerten</h3>

            {offers.length > 0 ? (
              offers.map((offer) => (
                <div key={offer.id} className="portal-side-card">
                  <strong>{offer.title}</strong>
                  <p>{offer.description || "Keine Beschreibung angegeben."}</p>
                  <p>
                    <strong>{formatCurrency(offer.amount)}</strong>
                    <br />
                    Status: {offerStatusLabels[offer.status]}
                  </p>
                  <small>{formatDate(offer.createdAt)}</small>
                </div>
              ))
            ) : (
              <p>Noch keine Offerten erstellt.</p>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === "activities" ? (
        <div className="premium-provider-card">
          <span className="eyebrow">Timeline</span>
          <h2>Aktivitäten</h2>

          <div style={{ marginTop: "24px", display: "grid", gap: "12px" }}>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="portal-side-card">
                  <strong>{activity.description}</strong>
                  <small>{formatDate(activity.createdAt)}</small>
                </div>
              ))
            ) : (
              <p>Noch keine Aktivitäten vorhanden.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}