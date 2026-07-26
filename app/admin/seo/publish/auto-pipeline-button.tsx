"use client";

import {
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import { optimizeAndPublishDrafts } from "./auto-pipeline";

export default function AutoPipelineButton() {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  function handlePipeline() {
    const confirmed = window.confirm(
      "Alle Entwürfe automatisch optimieren und geeignete Seiten veröffentlichen?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    startTransition(async () => {
      try {
        const result =
          await optimizeAndPublishDrafts();

        setMessage(result.message);
        router.refresh();
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Die automatische SEO-Pipeline ist fehlgeschlagen."
        );
      }
    });
  }

  return (
    <div className="pipeline-wrapper">
      <button
        type="button"
        onClick={handlePipeline}
        disabled={pending}
      >
        {pending
          ? "SEO-Pipeline läuft..."
          : "⚡ Optimieren & veröffentlichen"}
      </button>

      {message ? <span>{message}</span> : null}

      <style jsx>{`
        .pipeline-wrapper {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        button {
          min-height: 48px;
          padding: 0 18px;
          border: 0;
          border-radius: 13px;
          cursor: pointer;
          background:
            linear-gradient(
              135deg,
              #059669,
              #2563eb,
              #7c3aed
            );
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }

        button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        span {
          max-width: 320px;
          color: #86efac;
          font-size: 9px;
          font-weight: 700;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
