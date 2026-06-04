import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const DEMO_PROVIDER_EMAIL =
  process.env.DEMO_PROVIDER_EMAIL?.trim().toLowerCase() ||
  "info@cavara-hauswartung.ch";

const creditPackages = [
  {
    title: "Starter",
    credits: 50,
    price: "CHF 50",
    description: "Ideal zum Testen und für einzelne Lead-Käufe.",
  },
  {
    title: "Business",
    credits: 120,
    price: "CHF 100",
    description: "Mehr Credits für aktive Anbieter mit regelmässigen Leads.",
  },
  {
    title: "Pro",
    credits: 300,
    price: "CHF 250",
    description: "Für Anbieter, die laufend neue Aufträge freischalten.",
  },
];

async function addCreditsAction(formData: FormData) {
  "use server";

  const credits = Number(formData.get("credits") || 0);

  if (!credits) {
    redirect("/portal/guthaben?error=invalid");
  }

  await prisma.provider.update({
    where: {
      email: DEMO_PROVIDER_EMAIL,
    },
    data: {
      credits: {
        increment: credits,
      },
    },
  });

  redirect("/portal/guthaben?message=success");
}

export default async function GuthabenPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;

  const provider = await prisma.provider.findUnique({
    where: {
      email: DEMO_PROVIDER_EMAIL,
    },
  });

  return (
    <main className="page">
      <section className="credit-hero">
        <div className="container">
          <span className="eyebrow">Guthaben</span>

          <div className="credit-head">
            <div>
              <h1>Credits aufladen.</h1>
              <p>
                Lade Guthaben auf, um Leads freizuschalten und direkt mit
                potenziellen Kunden Kontakt aufzunehmen.
              </p>
            </div>

            <div className="credit-actions">
              <a href="/portal" className="btn btn-secondary">
                Dashboard
              </a>
              <a href="/portal/leads" className="btn btn-primary">
                Leads ansehen
              </a>
            </div>
          </div>

          {params?.message === "success" && (
            <div className="credit-success">
              Guthaben wurde erfolgreich aufgeladen.
            </div>
          )}

          {params?.error === "invalid" && (
            <div className="credit-error">
              Das Guthaben konnte nicht aufgeladen werden.
            </div>
          )}

          <div className="credit-overview">
            <div className="credit-balance-card">
              <span>Aktuelles Guthaben</span>
              <strong>{provider?.credits ?? 0}</strong>
              <small>Credits verfügbar</small>
            </div>

            <div className="credit-info-card">
              <span>Firma</span>
              <strong>{provider?.companyName || "Nicht gefunden"}</strong>
              <small>{provider?.email || DEMO_PROVIDER_EMAIL}</small>
            </div>
          </div>

          <div className="credit-packages">
            {creditPackages.map((item) => (
              <form
                key={item.title}
                action={addCreditsAction}
                className="credit-package-card"
              >
                <input type="hidden" name="credits" value={item.credits} />

                <span>{item.title}</span>
                <h2>{item.credits} Credits</h2>
                <p>{item.description}</p>

                <div className="credit-price">{item.price}</div>

                <button type="submit" className="btn btn-primary">
                  Paket auswählen
                </button>
              </form>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .credit-hero {
          padding: 72px 0 90px;
        }

        .credit-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-top: 18px;
          margin-bottom: 28px;
        }

        .credit-head h1 {
          color: white;
          font-size: clamp(3.2rem, 8vw, 7rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }

        .credit-head p {
          max-width: 760px;
          margin-top: 22px;
          color: rgba(245, 248, 255, 0.68);
          font-size: 1.15rem;
          line-height: 1.65;
        }

        .credit-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .credit-success,
        .credit-error {
          margin: 22px 0;
          width: fit-content;
          border-radius: 18px;
          padding: 14px 18px;
          font-weight: 900;
        }

        .credit-success {
          border: 1px solid rgba(34,197,94,0.24);
          background: rgba(34,197,94,0.12);
          color: #dcfce7;
        }

        .credit-error {
          border: 1px solid rgba(244,63,94,0.24);
          background: rgba(244,63,94,0.12);
          color: #ffe4e6;
        }

        .credit-overview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 24px;
        }

        .credit-balance-card,
        .credit-info-card,
        .credit-package-card {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 34px;
          background:
            linear-gradient(135deg, rgba(45,88,125,0.22), rgba(15,18,35,0.94)),
            rgba(255,255,255,0.04);
          box-shadow: 0 30px 80px rgba(0,0,0,0.28);
          padding: 30px;
        }

        .credit-balance-card span,
        .credit-info-card span,
        .credit-package-card span {
          display: block;
          color: rgba(245,248,255,0.52);
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .credit-balance-card strong,
        .credit-info-card strong {
          display: block;
          color: white;
          font-size: clamp(2.3rem, 5vw, 4.8rem);
          line-height: 1;
          margin-top: 12px;
          letter-spacing: -0.06em;
        }

        .credit-balance-card small,
        .credit-info-card small {
          display: block;
          margin-top: 10px;
          color: rgba(245,248,255,0.58);
          font-weight: 800;
        }

        .credit-packages {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .credit-package-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-height: 360px;
        }

        .credit-package-card h2 {
          margin-top: 14px;
          color: white;
          font-size: clamp(2rem, 4vw, 3.6rem);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .credit-package-card p {
          margin-top: 16px;
          color: rgba(245,248,255,0.66);
          line-height: 1.65;
        }

        .credit-price {
          margin-top: auto;
          margin-bottom: 22px;
          color: white;
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.05em;
        }

        @media (max-width: 1050px) {
          .credit-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .credit-overview,
          .credit-packages {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .credit-hero {
            padding: 46px 0 70px;
          }

          .credit-balance-card,
          .credit-info-card,
          .credit-package-card {
            padding: 22px;
            border-radius: 26px;
          }
        }
      `}</style>
    </main>
  );
}