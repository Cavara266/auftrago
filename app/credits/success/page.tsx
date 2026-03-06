"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      console.error("Keine Stripe Session ID gefunden");
      return;
    }

    async function finalize() {
      try {
        const res = await fetch("/api/stripe/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
          }),
        });

        const data = await res.json();

        console.log("Finalize response:", data);

        // Dashboard neu laden
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Finalize error:", error);
      }
    }

    finalize();
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] text-white">

      <div className="text-center">

        <h1 className="text-4xl font-semibold mb-4">
          Zahlung erfolgreich 🎉
        </h1>

        <p className="text-white/60">
          Credits werden deinem Konto gutgeschrieben...
        </p>

      </div>

    </main>
  );
}