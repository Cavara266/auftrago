import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  active?: "dashboard" | "leads" | "credits" | "login";
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
        "flex items-center justify-between rounded-xl px-3 py-2 text-sm ring-1 ring-white/10 transition",
        active
          ? "bg-white/12 text-white"
          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="text-xs text-white/35">→</span>
    </Link>
  );
}

export default function AppShell({ children, active }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/60 ring-1 ring-indigo-400/30">
            <span className="text-sm font-bold">A</span>
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Auftrago</div>
            <div className="text-xs text-white/55">Leads Portal</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Link className="btn" href="/leads">
            Leads
          </Link>
          <Link className="btn btn-primary" href="/credits">
            Credits
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="card h-fit p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
            Navigation
          </div>

          <div className="grid gap-2">
            <NavItem href="/dashboard" label="Dashboard" active={active === "dashboard"} />
            <NavItem href="/leads" label="Leads" active={active === "leads"} />
            <NavItem href="/credits" label="Credits" active={active === "credits"} />
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="text-xs text-white/60">Demo-Flow</div>
            <div className="mt-1 text-sm text-white/80">
              Leads → Kontakt freischalten → Credits/Transaktionen prüfen.
            </div>
          </div>

          <div className="mt-4 text-xs text-white/35">
            © {new Date().getFullYear()} Auftrago — Cavara Hauswartung
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}