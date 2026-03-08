import Link from "next/link";
import LogoutButton from "@/app/components/logout-button";

type Props = {
  children: React.ReactNode;
  active?: "dashboard" | "leads" | "credits";
  title?: string;
  subtitle?: string;
  credits?: number;
};

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
        active
          ? "border border-indigo-400/30 bg-indigo-500/20 text-white"
          : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>
      <span className="text-white/40">→</span>
    </Link>
  );
}

export default function AppShell({
  children,
  active,
  title = "Auftrago",
  subtitle = "Leads Portal",
  credits,
}: Props) {
  return (
    <div className="min-h-screen bg-[radial-gradient(900px_500px_at_10%_0%,rgba(99,102,241,0.18),transparent),radial-gradient(900px_500px_at_90%_10%,rgba(16,185,129,0.12),transparent),linear-gradient(to_bottom,#04070d,#02040a)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500 text-lg font-bold shadow-lg shadow-indigo-500/30">
              A
            </div>

            <div>
              <div className="text-xl font-semibold leading-tight">{title}</div>
              <div className="text-sm text-white/60">{subtitle}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {credits !== undefined && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                Credits: <span className="font-semibold text-white">{credits}</span>
              </div>
            )}

            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              Dashboard
            </Link>

            <Link
              href="/leads"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              Leads
            </Link>

            <Link
              href="/credits"
              className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
            >
              Credits kaufen
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Navigation
            </div>

            <div className="grid gap-2">
              <NavItem
                href="/dashboard"
                label="Dashboard"
                active={active === "dashboard"}
              />

              <NavItem
                href="/leads"
                label="Leads"
                active={active === "leads"}
              />

              <NavItem
                href="/credits"
                label="Credits"
                active={active === "credits"}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/55">Plattform Flow</div>

              <div className="mt-2 text-sm leading-relaxed text-white/75">
                Leads ansehen → Kontakt freischalten → Kunden kontaktieren →
                Credits & Transaktionen prüfen.
              </div>
            </div>

            <div className="mt-6 text-xs text-white/35">© 2026 Auftrago</div>
          </aside>

          <main className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}