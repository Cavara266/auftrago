import { prisma } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demoUser";

export default async function CreditsBadge() {
  const user = await getOrCreateDemoUser();
  const fresh = await prisma.user.findUnique({ where: { id: user.id } });

  const credits = fresh?.credits ?? 0;

  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
      <span className="text-xs text-white/70">Credits</span>
      <span className="rounded-lg bg-white/10 px-2 py-0.5 text-sm font-semibold">
        {credits}
      </span>
    </div>
  );
}