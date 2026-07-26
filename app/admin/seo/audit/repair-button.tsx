"use client";

import {
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import { repairSeoAuditIssues } from "./actions";

export default function AuditRepairButton() {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  function handleRepair() {
    const confirmed = window.confirm(
      "Alle automatisch behebbaren SEO-Probleme reparieren? Entwürfe werden dabei nicht veröffentlicht."
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    startTransition(async () => {
      try {
        const result =
          await repairSeoAuditIssues();

        setMessage(result.message);
        router.refresh();
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Die automatische SEO-Reparatur ist fehlgeschlagen."
        );
      }
    });
  }

  return (
    <div className="repair-wrapper">
      <button
        type="button"
        onClick={handleRepair}
        disabled={pending}
      >
        {pending
          ? "SEO-Probleme werden repariert..."
          : "⚡ SEO-Probleme automatisch reparieren"}
      </button>

      {message ? <span>{message}</span> : null}

      <style jsx>{`
        .repair-wrapper {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        button {
          min-height: 46px;
          padding: 0 16px;
          border: 0;
          border-radius: 12px;
          cursor: pointer;
          background: linear-gradient(
            135deg,
            #059669,
            #2563eb,
            #7c3aed
          );
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        span {
          max-width: 360px;
          color: #86efac;
          font-size: 9px;
          font-weight: 700;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
