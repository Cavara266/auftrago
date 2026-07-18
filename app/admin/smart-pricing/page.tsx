import { prisma } from "@/lib/prisma";
import SmartPricingForm from "./SmartPricingForm";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
  id: "default",
  enabled: true,
  firstAfterDays: 3,
  firstDiscountPercent: 15,
  secondAfterDays: 5,
  secondDiscountPercent: 30,
  thirdAfterDays: 7,
  thirdDiscountPercent: 50,
  minimumPrice: 10,
  resetAfterPurchase: true,
  label: "Smart Deal",
  showCountdown: true,
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-CH").format(value);
}

export default async function SmartPricingAdminPage() {
  const [settings, totalLeads, availableLeads, purchasedLeads] =
    await Promise.all([
      prisma.smartPricingSettings.upsert({
        where: {
          id: "default",
        },
        update: {},
        create: DEFAULT_SETTINGS,
      }),

      prisma.lead.count(),

      prisma.lead.count(),

      prisma.leadPurchase.count(),
    ]);

  const smartDealStartDate = new Date();
  smartDealStartDate.setDate(
    smartDealStartDate.getDate() - settings.firstAfterDays,
  );

  const smartDealLeads = await prisma.lead.count({
    where: {
      createdAt: {
        lte: smartDealStartDate,
      },
    },
  });

  return (
    <main className="smart-pricing-page">
      <section className="smart-pricing-hero">
        <div className="smart-pricing-hero-copy">
          <div className="smart-pricing-eyebrow">
            <span className="smart-pricing-eyebrow-icon">🔥</span>
            Auftrago Preisautomatisierung
          </div>

          <h1>Smart Pricing</h1>

          <p>
            Steuere automatisch, wie ältere Leads günstiger werden. Passe
            Rabattstufen, Mindestpreis und Countdown zentral an.
          </p>
        </div>

        <div
          className={`smart-pricing-status ${
            settings.enabled ? "is-enabled" : "is-disabled"
          }`}
        >
          <span className="smart-pricing-status-dot" />

          <div>
            <span>Aktueller Status</span>
            <strong>
              {settings.enabled ? "Smart Pricing aktiv" : "Smart Pricing pausiert"}
            </strong>
          </div>
        </div>
      </section>

      <section className="smart-pricing-stat-grid">
        <article className="smart-pricing-stat-card">
          <div className="smart-pricing-stat-icon">▤</div>

          <div>
            <span>Leads insgesamt</span>
            <strong>{formatNumber(totalLeads)}</strong>
            <small>Alle erfassten Kundenanfragen</small>
          </div>
        </article>

        <article className="smart-pricing-stat-card">
          <div className="smart-pricing-stat-icon">◎</div>

          <div>
            <span>Verfügbare Leads</span>
            <strong>{formatNumber(availableLeads)}</strong>
            <small>Aktuell nicht geschlossen</small>
          </div>
        </article>

        <article className="smart-pricing-stat-card smart-pricing-stat-highlight">
          <div className="smart-pricing-stat-icon">🔥</div>

          <div>
            <span>Aktuelle Smart Deals</span>
            <strong>{formatNumber(smartDealLeads)}</strong>
            <small>
              Mindestens {settings.firstAfterDays} Tage alte Leads
            </small>
          </div>
        </article>

        <article className="smart-pricing-stat-card">
          <div className="smart-pricing-stat-icon">💳</div>

          <div>
            <span>Freischaltungen</span>
            <strong>{formatNumber(purchasedLeads)}</strong>
            <small>Erfasste Lead-Käufe</small>
          </div>
        </article>
      </section>

      <SmartPricingForm
        initialSettings={{
          id: settings.id,
          enabled: settings.enabled,
          firstAfterDays: settings.firstAfterDays,
          firstDiscountPercent: settings.firstDiscountPercent,
          secondAfterDays: settings.secondAfterDays,
          secondDiscountPercent: settings.secondDiscountPercent,
          thirdAfterDays: settings.thirdAfterDays,
          thirdDiscountPercent: settings.thirdDiscountPercent,
          minimumPrice: settings.minimumPrice,
          resetAfterPurchase: settings.resetAfterPurchase,
          label: settings.label,
          showCountdown: settings.showCountdown,
        }}
      />

      <style>{`
        .smart-pricing-page {
          min-height: 100vh;
          padding: 34px;
          color: #f8fafc;
        }

        .smart-pricing-hero {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 28px;
          padding: 34px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 28px;
          background:
            radial-gradient(circle at 8% 0%, rgba(14,165,233,.18), transparent 36%),
            radial-gradient(circle at 92% 10%, rgba(99,102,241,.18), transparent 34%),
            linear-gradient(145deg, rgba(15,30,53,.92), rgba(8,20,39,.9));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.05),
            0 30px 80px rgba(0,0,0,.22);
        }

        .smart-pricing-hero::after {
          content: "";
          position: absolute;
          right: -100px;
          bottom: -160px;
          width: 340px;
          height: 340px;
          border-radius: 999px;
          background: rgba(56,189,248,.08);
          filter: blur(10px);
          pointer-events: none;
        }

        .smart-pricing-hero-copy {
          position: relative;
          z-index: 2;
          max-width: 720px;
        }

        .smart-pricing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 12px;
          border: 1px solid rgba(56,189,248,.22);
          border-radius: 999px;
          color: #bae6fd;
          background: rgba(14,165,233,.09);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .smart-pricing-eyebrow-icon {
          font-size: 14px;
        }

        .smart-pricing-hero h1 {
          margin: 19px 0 10px;
          font-size: clamp(34px, 5vw, 58px);
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 950;
        }

        .smart-pricing-hero p {
          max-width: 650px;
          margin: 0;
          color: rgba(226,232,240,.63);
          font-size: 16px;
          line-height: 1.75;
        }

        .smart-pricing-status {
          position: relative;
          z-index: 2;
          min-width: 230px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 16px 18px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(3,10,22,.42);
          backdrop-filter: blur(14px);
        }

        .smart-pricing-status.is-enabled {
          border-color: rgba(34,197,94,.22);
          background: rgba(22,101,52,.1);
        }

        .smart-pricing-status.is-disabled {
          border-color: rgba(248,113,113,.2);
          background: rgba(127,29,29,.1);
        }

        .smart-pricing-status-dot {
          flex: 0 0 auto;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #ef4444;
          box-shadow: 0 0 18px rgba(239,68,68,.75);
        }

        .smart-pricing-status.is-enabled .smart-pricing-status-dot {
          background: #22c55e;
          box-shadow: 0 0 18px rgba(34,197,94,.8);
        }

        .smart-pricing-status span,
        .smart-pricing-status strong {
          display: block;
        }

        .smart-pricing-status div > span {
          margin-bottom: 3px;
          color: rgba(226,232,240,.46);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .smart-pricing-status strong {
          font-size: 14px;
          font-weight: 900;
        }

        .smart-pricing-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .smart-pricing-stat-card {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 21px;
          background:
            linear-gradient(145deg, rgba(14,29,51,.86), rgba(8,20,38,.82));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.035),
            0 18px 46px rgba(0,0,0,.13);
        }

        .smart-pricing-stat-highlight {
          border-color: rgba(251,146,60,.2);
          background:
            radial-gradient(circle at 0% 0%, rgba(249,115,22,.14), transparent 48%),
            linear-gradient(145deg, rgba(38,25,22,.88), rgba(17,22,36,.86));
        }

        .smart-pricing-stat-icon {
          flex: 0 0 auto;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #bae6fd;
          background: rgba(56,189,248,.09);
          border: 1px solid rgba(56,189,248,.12);
          font-size: 19px;
          font-weight: 900;
        }

        .smart-pricing-stat-highlight .smart-pricing-stat-icon {
          color: #fed7aa;
          background: rgba(249,115,22,.1);
          border-color: rgba(249,115,22,.14);
        }

        .smart-pricing-stat-card div:last-child {
          min-width: 0;
        }

        .smart-pricing-stat-card span,
        .smart-pricing-stat-card strong,
        .smart-pricing-stat-card small {
          display: block;
        }

        .smart-pricing-stat-card span {
          color: rgba(226,232,240,.5);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .smart-pricing-stat-card strong {
          margin-top: 4px;
          color: #fff;
          font-size: 27px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -.035em;
        }

        .smart-pricing-stat-card small {
          margin-top: 7px;
          overflow: hidden;
          color: rgba(226,232,240,.4);
          font-size: 11px;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 1200px) {
          .smart-pricing-stat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .smart-pricing-page {
            padding: 20px 14px 34px;
          }

          .smart-pricing-hero {
            display: grid;
            padding: 24px 20px;
            border-radius: 23px;
          }

          .smart-pricing-status {
            width: 100%;
            min-width: 0;
          }

          .smart-pricing-stat-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </main>
  );
}