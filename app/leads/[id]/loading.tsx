// app/leads/[id]/loading.tsx
import AppShell from "@/app/components/app-shell";

export default function LoadingLeads() {
  return (
    <AppShell active="leads">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lead</h1>
            <p className="mt-1 text-sm text-white/60">Lade Lead…</p>
          </div>

          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm">
            Credits:{" "}
            <span className="ml-1 rounded-lg bg-white/10 px-2 py-0.5 font-semibold">
              …
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="mb-2 h-4 w-1/3 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}