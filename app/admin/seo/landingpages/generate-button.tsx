"use client";

import { useState, useTransition } from "react";
import { generateLandingPages } from "./actions";

export default function GenerateLandingPagesButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function runGenerator() {
    setMessage("");

    startTransition(async () => {
      try {
        const result = await generateLandingPages();

        setMessage(
          `${result.created} neu erstellt, ${result.updated} aktualisiert.`
        );

        window.location.reload();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Landingpages konnten nicht generiert werden."
        );
      }
    });
  }

  return (
    <div className="generator-action">
      <button
        type="button"
        onClick={runGenerator}
        disabled={isPending}
      >
        {isPending
          ? "Landingpages werden generiert..."
          : "Alle Kombinationen generieren"}
      </button>

      {message ? <span>{message}</span> : null}

      <style jsx>{`
        .generator-action {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        button {
          min-height: 50px;
          padding: 0 20px;
          border: 0;
          border-radius: 14px;
          cursor: pointer;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
        }

        button:disabled {
          cursor: wait;
          opacity: 0.65;
        }

        span {
          color: #93c5fd;
          font-size: 11px;
          font-weight: 700;
        }

        @media (max-width: 700px) {
          .generator-action,
          button {
            width: 100%;
          }

          .generator-action {
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
