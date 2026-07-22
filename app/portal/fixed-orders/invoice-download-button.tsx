"use client";

import { useState } from "react";

type FixedOrderInvoiceDownloadButtonProps = {
  fixedOrderId: string;
};

export default function FixedOrderInvoiceDownloadButton({
  fixedOrderId,
}: FixedOrderInvoiceDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  function downloadInvoice() {
    if (loading) {
      return;
    }

    setLoading(true);

    window.location.assign(
      `/api/fixed-orders/${fixedOrderId}/invoice`
    );

    window.setTimeout(() => {
      setLoading(false);
    }, 1500);
  }

  return (
    <button
      type="button"
      onClick={downloadInvoice}
      disabled={loading}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-bold text-amber-200 transition hover:bg-amber-400/20 disabled:cursor-wait disabled:opacity-60"
    >
      {loading
        ? "Rechnung wird erstellt..."
        : "PDF-Rechnung herunterladen"}
    </button>
  );
}