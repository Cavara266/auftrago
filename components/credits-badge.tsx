import { ensureDemoUser } from "@/lib/demoUser";

export default async function CreditsBadge() {
  const user = await ensureDemoUser();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
      <div className="text-xs uppercase tracking-wide text-white/50">
        Credits
      </div>
      <div className="mt-1 text-2xl font-semibold text-white">
        {"credits" in user ? user.credits : 0}
      </div>
    </div>
  );
}