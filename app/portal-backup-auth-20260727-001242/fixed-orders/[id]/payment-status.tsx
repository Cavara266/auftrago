"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type FixedOrderPaymentStatusProps = {
  fixedOrderId: string;
  paymentState?: string;
};

type StatusResponse = {
  ok?: boolean;
  status?: string;
  isOwner?: boolean;
  customerUrl?: string | null;
  error?: string;
};

type CancelReservationResponse = {
  ok?: boolean;
  released?: boolean;
  alreadyPaid?: boolean;
  error?: string;
};

const MAX_ATTEMPTS = 20;
const POLL_INTERVAL_MS = 1500;

export default function FixedOrderPaymentStatus({
  fixedOrderId,
  paymentState,
}: FixedOrderPaymentStatusProps) {
  const router = useRouter();
  const cancellationStarted = useRef(false);

  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState(
    paymentState === "success"
      ? "Zahlung bestätigt. Die Kundendaten werden freigeschaltet..."
      : paymentState === "cancelled"
        ? "Die Reservierung wird freigegeben..."
        : ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      paymentState !== "cancelled" ||
      cancellationStarted.current
    ) {
      return;
    }

    cancellationStarted.current = true;

    let cancelled = false;

    async function releaseReservation() {
      try {
        const response = await fetch(
          `/api/fixed-orders/${fixedOrderId}/cancel-reservation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data =
          (await response.json().catch(() => null)) as
            | CancelReservationResponse
            | null;

        if (cancelled) {
          return;
        }

        if (!response.ok || !data?.ok) {
          throw new Error(
            data?.error ||
              "Die Reservierung konnte nicht freigegeben werden."
          );
        }

        if (data.alreadyPaid) {
          setMessage(
            "Die Zahlung wurde bereits bestätigt. Du wirst zu den Kundendaten weitergeleitet..."
          );

          const statusResponse = await fetch(
            `/api/fixed-orders/${fixedOrderId}/status`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          const statusData =
            (await statusResponse
              .json()
              .catch(() => null)) as
              | StatusResponse
              | null;

          if (
            !cancelled &&
            statusResponse.ok &&
            statusData?.isOwner &&
            statusData.customerUrl
          ) {
            router.replace(statusData.customerUrl);
            router.refresh();
            return;
          }
        }

        setMessage("");
        router.refresh();
      } catch (releaseError) {
        if (cancelled) {
          return;
        }

        setMessage("");
        setError(
          releaseError instanceof Error
            ? releaseError.message
            : "Die Reservierung konnte nicht freigegeben werden."
        );
      }
    }

    releaseReservation();

    return () => {
      cancelled = true;
    };
  }, [fixedOrderId, paymentState, router]);

  useEffect(() => {
    if (paymentState !== "success") {
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null =
      null;
    let currentAttempt = 0;

    async function checkStatus() {
      try {
        const response = await fetch(
          `/api/fixed-orders/${fixedOrderId}/status`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data =
          (await response.json().catch(() => null)) as
            | StatusResponse
            | null;

        if (cancelled) {
          return;
        }

        if (
          response.ok &&
          data?.isOwner &&
          data.customerUrl
        ) {
          setMessage(
            "Erfolgreich freigeschaltet. Du wirst weitergeleitet..."
          );

          router.replace(data.customerUrl);
          router.refresh();
          return;
        }

        currentAttempt += 1;
        setAttempts(currentAttempt);

        if (currentAttempt >= MAX_ATTEMPTS) {
          setMessage("");
          setError(
            "Die Zahlung wurde abgeschlossen, aber die Freischaltung dauert länger als erwartet. Lade die Seite bitte in wenigen Sekunden neu."
          );
          return;
        }

        timeoutId = setTimeout(
          checkStatus,
          POLL_INTERVAL_MS
        );
      } catch {
        if (cancelled) {
          return;
        }

        currentAttempt += 1;
        setAttempts(currentAttempt);

        if (currentAttempt >= MAX_ATTEMPTS) {
          setMessage("");
          setError(
            "Der Zahlungsstatus konnte momentan nicht geprüft werden. Lade die Seite bitte erneut."
          );
          return;
        }

        timeoutId = setTimeout(
          checkStatus,
          POLL_INTERVAL_MS
        );
      }
    }

    checkStatus();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fixedOrderId, paymentState, router]);

  if (
    paymentState !== "success" &&
    paymentState !== "cancelled"
  ) {
    return null;
  }

  if (paymentState === "cancelled") {
    return (
      <div className="mb-6 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
        {message ? (
          <>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-amber-200/30 border-t-amber-200" />

              <p className="font-bold">{message}</p>
            </div>

            <p className="mt-2 leading-6 text-amber-100/80">
              Die Zahlung wurde abgebrochen. Der Auftrag
              wird wieder für andere Anbieter geöffnet.
            </p>
          </>
        ) : (
          <>
            <p className="font-bold">
              Zahlung abgebrochen
            </p>

            <p className="mt-2 leading-6 text-amber-100/80">
              Es wurde keine Zahlung abgeschlossen. Die
              Reservierung wurde aufgehoben und der Auftrag
              ist wieder verfügbar.
            </p>
          </>
        )}

        {error ? (
          <>
            <p className="mt-4 font-bold text-red-200">
              Freigabe fehlgeschlagen
            </p>

            <p className="mt-2 leading-6 text-red-100/80">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-white px-4 py-2 font-bold text-black transition hover:bg-slate-200"
            >
              Erneut versuchen
            </button>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-blue-400/25 bg-blue-400/10 p-4 text-sm text-blue-100">
      {message ? (
        <>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-blue-200/30 border-t-blue-200" />

            <p className="font-bold">{message}</p>
          </div>

          <p className="mt-2 leading-6 text-blue-100/80">
            Stripe hat dich zurückgeleitet. Wir warten kurz
            auf die endgültige Bestätigung des Webhooks.
          </p>

          {attempts > 0 ? (
            <p className="mt-2 text-xs text-blue-100/60">
              Prüfversuch {attempts} von {MAX_ATTEMPTS}
            </p>
          ) : null}
        </>
      ) : null}

      {error ? (
        <>
          <p className="font-bold text-red-200">
            Freischaltung noch ausstehend
          </p>

          <p className="mt-2 leading-6 text-red-100/80">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-white px-4 py-2 font-bold text-black transition hover:bg-slate-200"
          >
            Seite neu laden
          </button>
        </>
      ) : null}
    </div>
  );
}