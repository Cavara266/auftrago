import Link from "next/link";
import {
  redirect,
  notFound,
} from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import LeadWorkspace from "./lead-workspace";
import "./lead-workspace.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params:
    | {
        purchaseId: string;
      }
    | Promise<{
        purchaseId: string;
      }>;
};

export default async function LeadDetailPage({
  params,
}: PageProps) {
  const resolvedParams = await params;

  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const purchase =
    await prisma.leadPurchase.findFirst({
      where: {
        id: resolvedParams.purchaseId,
        providerId: user.id,
      },
      include: {
        lead: true,
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        activities: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!purchase) {
    notFound();
  }

  return (
    <main className="lead-workspace-page">
      <div className="lead-workspace-page__glow lead-workspace-page__glow--one" />
      <div className="lead-workspace-page__glow lead-workspace-page__glow--two" />

      <div className="lead-workspace-page__container">
        <header className="lead-workspace-page__header">
          <div>
            <span className="lead-workspace-page__eyebrow">
              CRM · KUNDENANFRAGE
            </span>

            <h1>
              {purchase.lead.title}
            </h1>

            <p>
              Kontakt, Verkaufsstatus, Notizen und
              sämtliche Aktivitäten zentral verwalten.
            </p>
          </div>

          <Link
            href="/portal/meine-leads"
            className="lead-workspace-page__back"
          >
            <span>←</span>
            Zurück zum CRM
          </Link>
        </header>

        <LeadWorkspace
          purchase={{
            id: purchase.id,
            status: purchase.status,
            price: purchase.price,
            createdAt:
              purchase.createdAt.toISOString(),
            lead: {
              id: purchase.lead.id,
              title: purchase.lead.title,
              description:
                purchase.lead.description,
              name: purchase.lead.name,
              email: purchase.lead.email,
              phone: purchase.lead.phone,
              region: purchase.lead.region,
              category:
                purchase.lead.category,
              price: purchase.lead.price,
              createdAt:
                purchase.lead.createdAt.toISOString(),
            },
            notes: purchase.notes.map(
              (note) => ({
                id: note.id,
                content: note.content,
                createdAt:
                  note.createdAt.toISOString(),
              })
            ),
            messages:
              purchase.messages.map(
                (message) => ({
                  id: message.id,
                  sender: message.sender,
                  message: message.message,
                  createdAt:
                    message.createdAt.toISOString(),
                })
              ),
            activities:
              purchase.activities.map(
                (activity) => ({
                  id: activity.id,
                  type: activity.type,
                  description:
                    activity.description,
                  createdAt:
                    activity.createdAt.toISOString(),
                })
              ),
          }}
        />
      </div>
    </main>
  );
}
