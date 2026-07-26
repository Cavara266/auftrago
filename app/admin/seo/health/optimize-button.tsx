"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  optimizeAllLandingPages,
  optimizeLandingPage,
} from "./actions";

type OptimizeButtonProps =
  | {
      mode: "single";
      landingPageId: string;
    }
  | {
      mode: "all";
      landingPageId?: never;
    };

export default function OptimizeButton(
  props: OptimizeButtonProps
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function runOptimization() {
    setMessage("");

    startTransition(async () => {
      try {
        if (props.mode === "all") {
          const result = await optimizeAllLandingPages();

          setMessage(
            `${result.optimized} Seiten optimiert` +
              (result.failed > 0
                ? `, ${result.failed} fehlgeschlagen.`
                : ".")
          );
        } else {
          const result = await optimizeLandingPage(
            props.landingPageId
          );

          setMessage(`${result.title} wurde optimiert.`);
        }

        router.refresh();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "SEO-Optimierung ist fehlgeschlagen."
        );
      }
    });
  }

  return (
    <div className="optimize-wrapper">
      <button
        type="button"
        onClick={runOptimization}
        disabled={isPending}
        className={
          props.mode === "all"
            ? "optimize-button optimize-all"
            : "optimize-button"
        }
      >
        {isPending
          ? "SEO wird optimiert..."
          : props.mode === "all"
            ? "✦ Alle Seiten optimieren"
            : "✦ Automatisch optimieren"}
      </button>

      {message ? (
        <span className="optimize-message">{message}</span>
      ) : null}

      <style jsx>{`
        .optimize-wrapper {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .optimize-button {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          justify-content: center;
          padding: 0 13px;
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 10px;
          cursor: pointer;
          background: rgba(37, 99, 235, 0.1);
          color: #93c5fd;
          font-size: 10px;
          font-weight: 900;
        }

        .optimize-button.optimize-all {
          min-height: 49px;
          padding: 0 18px;
          border: 0;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #7c3aed
          );
          color: #ffffff;
          font-size: 12px;
        }

        .optimize-button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        .optimize-message {
          color: #86efac;
          font-size: 10px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
