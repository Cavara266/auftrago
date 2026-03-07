"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type CreditsSuccessClientProps = {
  sessionId: string;
};

export default function CreditsSuccessClient({
  sessionId,
}: CreditsSuccessClientProps) {
  const router = useRouter();
  const hasRun = useRef(false);

  const [status, setStatus] = useState<
    "loading" | "success" | "already" | "error"
  >("loading");
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

    async function finalize() {
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
          setStatus("error");
          setMessage(
            data?.error || "Die Zahlung konnte nicht verarbeitet werden."
          );
          return;
        }

        if (data?.alreadyProcessed) {
          setStatus("already");
          setMessage("Die Credits wurden bereits gutgeschrieben.");

          redirectTimer = setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1400);

          return;
        }

        setStatus("success");
        setMessage(
          `${data?.creditsAdded ?? 0} Credits wurden erfolgreich gutgeschrieben.`
        );

        redirectTimer = setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1400);
      } catch {
        if (cancelled) return;
        setStatus("error");
        setMessage("Serverfehler bei der Zahlungsbestätigung.");
      }
    }

    finalize();

    return () => {
      cancelled = true;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [router, sessionId]);

  return (
    <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur sm:rounded-[34px] sm:p-8 md:p-10">
      <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
        {status === "loading" && "Zahlung wird verarbeitet"}
        {status === "success" && "Zahlung erfolgreich"}
        {status === "already" && "Bereits verarbeitet"}
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