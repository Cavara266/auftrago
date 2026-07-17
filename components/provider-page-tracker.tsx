"use client";

import { useEffect } from "react";

type ProviderPageTrackerProps = {
  event: string;
  page: string;
  description?: string;
  leadId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export default function ProviderPageTracker({
  event,
  page,
  description,
  leadId,
  metadata,
}: ProviderPageTrackerProps) {
  useEffect(() => {
    const controller = new AbortController();

    async function trackActivity() {
      try {
        await fetch("/api/provider-activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
          body: JSON.stringify({
            event,
            page,
            description,
            leadId,
            metadata,
          }),
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("PAGE TRACKING ERROR:", error);
      }
    }

    void trackActivity();

    return () => {
      controller.abort();
    };
  }, [
    event,
    page,
    description,
    leadId,
    metadata,
  ]);

  return null;
}