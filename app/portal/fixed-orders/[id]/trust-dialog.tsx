"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Auftrag prüfen",
    description:
      "Du siehst Leistungsumfang, Einsatzort, Auftragswert und Vermittlungsgebühr.",
  },
  {
    number: "02",
    title: "Sicher übernehmen",
    description:
      "Die Vermittlungsgebühr wird sicher über Stripe bezahlt.",
  },
  {
    number: "03",
    title: "Kundendaten erhalten",
    description:
      "Nach erfolgreicher Zahlung werden Name, Telefon, E-Mail und Adresse sofort freigeschaltet.",
  },
  {
    number: "04",
    title: "Direkt ausführen",
    description:
      "Du kontaktierst den Kunden, organisierst den Termin und führst den Auftrag aus.",
  },
  {
    number: "05",
    title: "Kunden fakturieren",
    description:
      "Du stellst deine Rechnung direkt dem Kunden und behältst den vollständigen Auftragswert.",
  },
];

export default function FixedOrderTrustDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-bold text-amber-200 transition hover:bg-amber-400/20"
      >
        <span aria-hidden="true">🛡️</span>
        Wie funktionieren Fixaufträge?
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fixed-order-dialog-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setOpen(false);
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0d1320] shadow-2xl shadow-black/60">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-white/10 bg-[#0d1320]/95 px-6 py-5 backdrop-blur sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  Auftrago Fixauftrag
                </p>

                <h2
                  id="fixed-order-dialog-title"
                  className="mt-2 text-2xl font-bold text-white sm:text-3xl"
                >
                  So funktioniert die sichere Übernahme
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Dialog schliessen"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-xl text-slate-300 transition hover:bg-white/[0.1] hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-5">
                <p className="text-sm font-bold text-emerald-200">
                  Kein klassischer Lead
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Ein Fixauftrag ist ein bereits bestätigter Auftrag. Nach
                  erfolgreicher Zahlung wird er exklusiv dir zugeordnet und
                  die vollständigen Kundendaten werden freigeschaltet.
                </p>
              </div>

              <div className="mt-7 space-y-0">
                {STEPS.map((step, index) => (
                  <div
                    key={step.number}
                    className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-4"
                  >
                    <div className="relative flex justify-center">
                      <div className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-amber-400/35 bg-amber-400/10 text-xs font-black text-amber-300">
                        {step.number}
                      </div>

                      {index < STEPS.length - 1 ? (
                        <div className="absolute bottom-0 top-11 w-px bg-gradient-to-b from-amber-400/45 to-white/10" />
                      ) : null}
                    </div>

                    <div className="pb-7">
                      <h3 className="text-base font-bold text-white">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <p className="text-sm font-bold text-white">
                    Was du bezahlst
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Nur die auf der Auftragsseite klar ausgewiesene
                    Vermittlungsgebühr.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <p className="text-sm font-bold text-white">
                    Was du erhältst
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Den exklusiven Auftrag und sofortigen Zugang zu allen
                    hinterlegten Kundendaten.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-5">
                <p className="text-sm font-bold text-amber-200">
                  Auftrago Käuferschutz
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Weicht ein Auftrag erheblich von der Beschreibung ab oder
                  kann er aus Gründen, die du nicht zu vertreten hast, nicht
                  durchgeführt werden, prüfen wir den Fall individuell und
                  suchen gemeinsam nach einer fairen Lösung.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}