import Link from "next/link";

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
          ? "bg-white/10 text-white border border-white/15"
          : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white",
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
    <div className="min-h-screen bg-[radial-gradient(1000px_500px_at_10%_0%,rgba(99,102,241,0.18),transparent),radial-gradient(900px_500px_at_90%_10%,rgba(16,185,129,0.12),transparent),linear-gradient(to_bottom,#04070d,#02040a)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Topbar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/90 text-lg font-bold shadow-lg shadow-indigo-500/20">
              A
            </div>
            <div>
              <div className="text-xl font-semibold leading-tight">{title}</div>
              <div className="text-sm text-white/60">{subtitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/leads"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Leads
            </Link>
            <Link
              href="/credits"
              className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400"
            >
              Credits
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Navigation
            </div>

            <div className="grid gap-2">
              <NavItem href="/dashboard" label="Dashboard" active={active === "dashboard"} />
              <NavItem href="/leads" label="Leads" active={active === "leads"} />
              <NavItem href="/credits" label="Credits" active={active === "credits"} />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/55">Demo-Flow</div>
              <div className="mt-2 text-sm text-white/75">
                Leads ansehen → Kontakt freischalten → Credits &amp; Transaktionen prüfen.
              </div>
            </div>

            <div className="mt-6 text-xs text-white/35">© 2026 Auftrago</div>
          </aside>

          {/* Content */}
          <main className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            {typeof credits === "number" && (
              <div className="mb-6 flex justify-end">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                  <div className="text-xs text-white/50">Credits</div>
                  <div className="text-2xl font-bold">{credits}</div>
                </div>
              </div>
            )}

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}