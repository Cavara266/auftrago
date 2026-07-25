import Link from "next/link";
import FixedOrderForm from "./fixed-order-form";

export const dynamic = "force-dynamic";

export default function NewFixedOrderPage() {
  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/admin/fixed-orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            ← Zurück zu den Fixaufträgen
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Auftrago Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Neuen Fixauftrag erstellen
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Erfasse einen bereits bestätigten Auftrag. Der Anbieter bezahlt
              25 % Vermittlungsgebühr und erhält danach die vollständigen
              Kundendaten.
            </p>
          </div>
        </div>

        <FixedOrderForm />
      </div>
    </main>
  );
}