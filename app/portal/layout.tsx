import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import PortalShell from "@/components/portal/portal-shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PortalShell>
      {children}
    </PortalShell>
  );
}
