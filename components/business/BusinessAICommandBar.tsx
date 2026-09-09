"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function BusinessAICommandBar() {
  const router = useRouter();

  const [command, setCommand] = useState("");
  const [working, setWorking] = useState(false);

  function execute(event?: FormEvent) {
    event?.preventDefault();

    const raw = command.trim();

    if (!raw) {
      router.push("/portal/business/ai");
      return;
    }

    setWorking(true);

    const text = raw.toLowerCase();

    // ------------------------------------------------------
    // RECHNUNGEN
    // ------------------------------------------------------

    if (
      text.includes("überfällig") ||
      text.includes("ueberfaellig") ||
      text.includes("offene rechnung") ||
      text.includes("offenen rechnung") ||
      text.includes("rechnungen anzeigen") ||
      text.includes("rechnungen öffnen")
    ) {
      router.push("/portal/business/rechnungen");
      return;
    }

    // ------------------------------------------------------
    // KUNDEN / CRM
    // ------------------------------------------------------

    if (
      text === "kunden" ||
      text.includes("kunden anzeigen") ||
      text.includes("kunden öffnen") ||
      text.includes("crm") ||
      text.includes("kundendaten")
    ) {
      router.push("/portal/business/kunden");
      return;
    }

    // ------------------------------------------------------
    // ANALYTICS / UMSATZ
    // ------------------------------------------------------

    if (
      text.includes("umsatz") ||
      text.includes("analytics") ||
      text.includes("statistik") ||
      text.includes("kennzahlen") ||
      text.includes("performance")
    ) {
      router.push("/portal/business/analytics");
      return;
    }

    // ------------------------------------------------------
    // BESTEHENDE OFFERTEN
    // ------------------------------------------------------

    if (
      text.includes("offene offerte") ||
      text.includes("offenen offerte") ||
      text.includes("offerten anzeigen") ||
      text.includes("offerten öffnen") ||
      text.includes("offerten nachfassen")
    ) {
      router.push("/portal/business/offerten");
      return;
    }

    // ------------------------------------------------------
    // NEUE OFFERTE -> AUFTRAGO AI
    // ------------------------------------------------------

    if (
      text.includes("offerte") ||
      text.includes("angebot") ||
      text.includes("preis erstellen") ||
      text.includes("kostenvoranschlag")
    ) {
      router.push(
        `/portal/business/ai?prompt=${encodeURIComponent(raw)}`
      );
      return;
    }

    // ------------------------------------------------------
    // ZAHLUNGEN / TRANSAKTIONEN
    // ------------------------------------------------------

    if (
      text.includes("zahlung") ||
      text.includes("transaktion") ||
      text.includes("zahlungseingang")
    ) {
      router.push("/portal/business/transaktionen");
      return;
    }

    // ------------------------------------------------------
    // FALLBACK -> AUFTRAGO AI
    // ------------------------------------------------------

    router.push(
      `/portal/business/ai?prompt=${encodeURIComponent(raw)}`
    );
  }

  return (
    <form
      onSubmit={execute}
      style={{
        display: "grid",
        gridTemplateColumns: "44px minmax(0,1fr) auto",
        gap: 10,
        alignItems: "center",
        width: "100%",
        padding: 7,
        borderRadius: 18,
        border: "1px solid rgba(125,211,252,.13)",
        background:
          "linear-gradient(90deg,rgba(2,6,23,.68),rgba(15,23,42,.56))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.025), 0 15px 45px rgba(2,6,23,.15)",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(135deg,rgba(14,165,233,.16),rgba(124,58,237,.25))",
          border:
            "1px solid rgba(125,211,252,.15)",
          color: "#bae6fd",
          fontSize: 18,
          fontWeight: 950,
        }}
      >
        ✦
      </div>

      <input
        value={command}
        onChange={(event) =>
          setCommand(event.target.value)
        }
        placeholder="Frag Auftrago AI: Erstelle eine Offerte, zeige offene Rechnungen, analysiere meinen Umsatz..."
        style={{
          width: "100%",
          minWidth: 0,
          height: 44,
          border: 0,
          outline: 0,
          background: "transparent",
          color: "#f8fafc",
          fontSize: 13,
          fontWeight: 700,
        }}
      />

      <button
        type="submit"
        disabled={working}
        style={{
          minHeight: 44,
          padding: "0 22px",
          border: 0,
          borderRadius: 13,
          background:
            "linear-gradient(100deg,#0ea5e9,#6366f1,#7c3aed)",
          color: "#fff",
          fontWeight: 950,
          fontSize: 12,
          cursor: working ? "wait" : "pointer",
          whiteSpace: "nowrap",
          boxShadow:
            "0 10px 28px rgba(99,102,241,.20)",
          opacity: working ? 0.7 : 1,
        }}
      >
        {working
          ? "Wird geöffnet..."
          : "Mit AI starten →"}
      </button>
    </form>
  );
}
