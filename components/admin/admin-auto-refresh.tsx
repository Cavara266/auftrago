"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type AdminAutoRefreshProps = {
  intervalSeconds?: number;
};

export default function AdminAutoRefresh({
  intervalSeconds = 15,
}: AdminAutoRefreshProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [secondsLeft, setSecondsLeft] = useState(intervalSeconds);

  function refreshNow() {
    setSecondsLeft(intervalSeconds);

    startTransition(() => {
      router.refresh();
    });
  }

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          startTransition(() => {
            router.refresh();
          });

          return intervalSeconds;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(countdown);
  }, [intervalSeconds, router]);

  return (
    <button
      type="button"
      className="admin-btn admin-btn-secondary"
      onClick={refreshNow}
      disabled={isPending}
      title="Dashboarddaten aktualisieren"
    >
      {isPending ? "Aktualisiert..." : `↻ Live · ${secondsLeft}s`}
    </button>
  );
}