"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type CreditsSuccessClientProps = {
  sessionId: string;
};

type Status = "loading" | "success" | "already" | "timeout" | "error";

export default function CreditsSuccessClient({
  sessionId,
}: CreditsSuccessClientProps) {
  const router = useRouter();
  const hasRun = useRef(false);

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Zahlung wird geprüft ...");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!sessionId) {
      setStatus("error");
      setMessage("Keine Stripe Session gefunden.");
      return;
    }

    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;
    let pollingTimer: ReturnType<typeof setTimeout> | null = null;

    async function checkStatus() {
      const res = await fetch("/api/stripe/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json().catch(() => null);

      if (cancelled) return false;

      if (!res.ok) {
        return false;
      }

      if (data?.processed) {
        setStatus("success");
        setMessage(
          `${data?.creditsAdded ?? 0} Credits wurden erfolgreich gutgeschrieben.`
        );

        redirectTimer = setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);

        return true;
      }

      return false;
    }

    async function fallbackFinalize() {
      try {
        const res = await fetch("/api/stripe/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json().catch(() => null);

        if (cancelled) return;

        if (!res.ok) {
          setStatus("timeout");
          setMessage(
            data?.error ||
              "Die Zahlung dauert länger als erwartet. Bitte öffne das Dashboard und prüfe deine Credits."
          );
          return;
        }

        if (data?.alreadyProcessed) {
          setStatus("already");
          setMessage("Die Credits wurden bereits gutgeschrieben.");
        } else {
          setStatus("success");
          setMessage(
            `${data?.creditsAdded ?? 0} Credits wurden erfolgreich gutgeschrieben.`
          );
        }

        redirectTimer = setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } catch {
        if (cancelled) return;

        setStatus("timeout");
        setMessage(
          "Die Zahlung dauert länger als erwartet. Bitte öffne das Dashboard und prüfe deine Credits."
        );
      }
    }

    async function startFlow() {
      try {
        const immediate = await checkStatus();
        if (immediate || cancelled) return;

        let attempts = 0;
        const maxAttempts = 3;

        const poll = async () => {
          attempts += 1;

          try {
            const done = await checkStatus();
            if (done || cancelled) return;

            if (attempts >= maxAttempts) {
              await fallbackFinalize();
              return;
            }

            pollingTimer = setTimeout(poll, 700);
          } catch {
            await fallbackFinalize();
          }
        };

        pollingTimer = setTimeout(poll, 700);
      } catch {
        await fallbackFinalize();
      }
    }

    startFlow();

    return () => {
      cancelled = true;
      if (redirectTimer) clearTimeout(redirectTimer);
      if (pollingTimer) clearTimeout(pollingTimer);
    };
  }, [router, sessionId]);

  return (
    <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur sm:rounded-[34px] sm:p-8 md:p-10">
      <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
        {status === "loading" && "Zahlung wird verarbeitet"}
        {status === "success" && "Zahlung erfolgreich"}
        {status === "already" && "Bereits verarbeitet"}
        {status === "timeout" && "Bestätigung dauert länger"}
        {status === "error" && "Fehler bei der Zahlung"}
      </h1>

      <p className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
        {message}
      </p>

      {status === "loading" ? (
        <div className="mt-8 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-[#7EC8FF]" />
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-black transition hover:bg-[#6BBEFF] sm:w-auto"
        >
          Zum Dashboard
        </Link>

        <Link
          href="/credits"
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
        >
          Zurück zu Credits
        </Link>
      </div>
    </div>
  );
}