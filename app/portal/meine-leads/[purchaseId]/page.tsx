import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LeadWorkspace from "./lead-workspace";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    purchaseId: string;
  };
};

export default async function LeadDetailPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) redirect("/login");

  const purchase = await prisma.leadPurchase.findFirst({
    where: {
      id: params.purchaseId,
      providerId,
    },
    include: {
      lead: true,
      notes: {
        orderBy: { createdAt: "desc" },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!purchase) notFound();

  return (
    <main className="page">
      <section className="portal-clean">
        <div className="container">
          <div className="portal-section-head">
            <div>
              <span>Lead bearbeiten</span>
              <h1>{purchase.lead.title}</h1>
              <p>
                Status, Notizen, Aktivitäten und Chat zu dieser Kundenanfrage.
              </p>
            </div>

            <Link href="/portal/meine-leads" className="btn btn-secondary">
              Zurück
            </Link>
          </div>

          <LeadWorkspace
            purchase={{
              id: purchase.id,
              status: purchase.status,
              price: purchase.price,
              createdAt: purchase.createdAt.toISOString(),
              lead: {
                id: purchase.lead.id,
                title: purchase.lead.title,
                description: purchase.lead.description,
                name: purchase.lead.name,
                email: purchase.lead.email,
                phone: purchase.lead.phone,
                region: purchase.lead.region,
                category: purchase.lead.category,
                price: purchase.lead.price,
                createdAt: purchase.lead.createdAt.toISOString(),
              },
              notes: purchase.notes.map((note) => ({
                id: note.id,
                content: note.content,
                createdAt: note.createdAt.toISOString(),
              })),
              messages: purchase.messages.map((message) => ({
                id: message.id,
                sender: message.sender,
                message: message.message,
                createdAt: message.createdAt.toISOString(),
              })),
              activities: purchase.activities.map((activity) => ({
                id: activity.id,
                type: activity.type,
                description: activity.description,
                createdAt: activity.createdAt.toISOString(),
              })),
            }}
          />
        </div>
      </section>
    </main>
  );
}