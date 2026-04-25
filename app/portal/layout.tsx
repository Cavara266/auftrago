import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/login/actions";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#030816] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/50">
              Anbieter Portal
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              Eingeloggt als {session.email}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/portal" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
              Dashboard
            </a>
            <a href="/portal/leads" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
              Leads
            </a>
            <a href="/portal/guthaben" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
              Guthaben
            </a>
            <a href="/portal/profil" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
              Profil
            </a>
            <a href="/portal/einstellungen" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
              Einstellungen
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-100 hover:bg-rose-400/15"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}