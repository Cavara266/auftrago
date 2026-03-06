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

    async function finalize() {
      try {
        const res = await fetch("/api/stripe/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setStatus("error");
          setMessage(data?.error || "Die Zahlung konnte nicht verarbeitet werden.");
          return;
        }

        if (data?.alreadyProcessed) {
          setStatus("already");
          setMessage("Die Credits wurden bereits gutgeschrieben.");

          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1200);

          return;
        }

        setStatus("success");
        setMessage(
          `${data?.creditsAdded ?? ""} Credits wurden erfolgreich gutgeschrieben.`
        );

        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1200);
      } catch {
        if (cancelled) return;
        setStatus("error");
        setMessage("Serverfehler bei der Zahlungsbestätigung.");
      }
    }

    finalize();

    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
        <h1 className="text-4xl font-semibold">
          {status === "loading" && "Zahlung wird verarbeitet"}
          {status === "success" && "Zahlung erfolgreich"}
          {status === "already" && "Bereits verarbeitet"}
          {status === "error" && "Fehler bei der Zahlung"}
        </h1>

        <p className="mt-4 text-lg text-white/65">{message}</p>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-black hover:bg-[#6BBEFF]"
          >
            Zum Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}