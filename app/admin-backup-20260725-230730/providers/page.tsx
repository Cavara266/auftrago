import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendProviderApprovalMail } from "@/lib/provider-approval-mail";
import SetProviderPassword from "./set-provider-password";

type ProviderStatus = "PENDING" | "APPROVED" | "BLOCKED";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  if (status === "APPROVED") return "Genehmigt";
  if (status === "BLOCKED") return "Gesperrt";
  return "Ausstehend";
}

function statusClass(status: string) {
  if (status === "APPROVED") return "status status-approved";
  if (status === "BLOCKED") return "status status-blocked";
  return "status status-pending";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatMoney(amountInRappen: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(amountInRappen / 100);
}

async function updateProvider(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const companyName = String(formData.get("companyName") || "").trim();
  const contactName = String(formData.get("contactName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const credits = Math.max(0, Number(formData.get("credits") || 0));
  const description = String(formData.get("description") || "").trim();
  const status = String(formData.get("status") || "PENDING") as ProviderStatus;

  await prisma.provider.update({
    where: { id },
    data: {
      companyName,
      contactName,
      email,
      phone,
      website,
      region,
      category,
      city,
      credits,
      description,
      status,
    },
  });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/anbieter");
}

async function addCredits(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const amount = Number(formData.get("amount") || 0);

  const provider = await prisma.provider.findUnique({
    where: { id },
    select: { credits: true },
  });

  if (!provider) return;

  await prisma.provider.update({
    where: { id },
    data: { credits: Math.max(0, provider.credits + amount) },
  });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
}

async function setStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "").trim();
  const requestedStatus = String(formData.get("status") || "PENDING").trim();
  const allowedStatuses: ProviderStatus[] = ["PENDING", "APPROVED", "BLOCKED"];

  if (!id) throw new Error("Anbieter-ID fehlt.");
  if (!allowedStatuses.includes(requestedStatus as ProviderStatus)) {
    throw new Error("Ungültiger Anbieterstatus.");
  }

  const status = requestedStatus as ProviderStatus;
  const existingProvider = await prisma.provider.findUnique({
    where: { id },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      status: true,
    },
  });

  if (!existingProvider) throw new Error("Anbieter wurde nicht gefunden.");

  const provider = await prisma.provider.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      status: true,
    },
  });

  const changedToApproved =
    status === "APPROVED" && existingProvider.status !== "APPROVED";

  if (changedToApproved) {
    try {
      await sendProviderApprovalMail({
        companyName: provider.companyName,
        contactName: provider.contactName,
        email: provider.email,
      });
    } catch (error) {
      console.error("PROVIDER APPROVAL MAIL ERROR:", error);
    }
  }

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/anbieter");
  revalidatePath("/login");
  revalidatePath("/leads");
  revalidatePath("/credits");
}

async function resendApprovalMail(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/admin/providers?error=approval-mail-failed");

  const provider = await prisma.provider.findUnique({
    where: { id },
    select: { companyName: true, contactName: true, email: true },
  });

  if (!provider) redirect("/admin/providers?error=provider-not-found");

  try {
    await sendProviderApprovalMail({
      companyName: provider.companyName,
      contactName: provider.contactName,
      email: provider.email,
    });
  } catch (error) {
    console.error("PROVIDER APPROVAL MAIL RESEND ERROR:", error);
    redirect("/admin/providers?error=approval-mail-failed");
  }

  revalidatePath("/admin/providers");
  redirect("/admin/providers?message=approval-mail-sent");
}

async function resetCredits(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  await prisma.provider.update({ where: { id }, data: { credits: 0 } });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
}

async function deleteProvider(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  await prisma.provider.delete({ where: { id } });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/anbieter");
}

export default async function AdminProvidersPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    status?: string;
    message?: string;
    error?: string;
  };
}) {
  const q = String(searchParams?.q || "").trim();
  const statusFilter = String(searchParams?.status || "ALL").trim();
  const message = String(searchParams?.message || "").trim();
  const error = String(searchParams?.error || "").trim();

  const [providers, allProviders] = await Promise.all([
    prisma.provider.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { companyName: { contains: q, mode: "insensitive" } },
                  { contactName: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                  { phone: { contains: q, mode: "insensitive" } },
                  { region: { contains: q, mode: "insensitive" } },
                  { category: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          statusFilter !== "ALL"
            ? { status: statusFilter as ProviderStatus }
            : {},
        ],
      },
      include: { purchases: true, creditPurchases: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.provider.findMany({
      include: { purchases: true, creditPurchases: true },
    }),
  ]);

  const totalProviders = allProviders.length;
  const pendingCount = allProviders.filter((p) => p.status === "PENDING").length;
  const approvedCount = allProviders.filter((p) => p.status === "APPROVED").length;
  const blockedCount = allProviders.filter((p) => p.status === "BLOCKED").length;
  const totalCredits = allProviders.reduce((sum, p) => sum + p.credits, 0);
  const totalPurchases = allProviders.reduce(
    (sum, p) => sum + p.purchases.length,
    0
  );
  const totalRevenue = allProviders.reduce(
    (sum, p) =>
      sum +
      p.creditPurchases
        .filter((purchase) => purchase.status === "paid")
        .reduce((innerSum, purchase) => innerSum + purchase.amount, 0),
    0
  );
  const approvalRate = totalProviders
    ? Math.round((approvedCount / totalProviders) * 100)
    : 0;

  return (
    <main className="providers-page">
      <style>{`
        .providers-page{min-height:100vh;padding:64px 0 96px;background:radial-gradient(circle at 15% 0%,rgba(14,165,233,.16),transparent 31%),radial-gradient(circle at 85% 12%,rgba(99,102,241,.20),transparent 34%),linear-gradient(180deg,#071426 0%,#08111f 48%,#060d18 100%);color:#f8fafc}
        .providers-shell{width:min(1480px,calc(100% - 40px));margin:0 auto}
        .topbar{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
        .eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:900;color:#c4b5fd}
        .eyebrow:before{content:"";width:9px;height:9px;border-radius:999px;background:#22c55e;box-shadow:0 0 0 6px rgba(34,197,94,.13)}
        h1{margin:14px 0 0;font-size:clamp(38px,5vw,66px);letter-spacing:-.055em;line-height:1.02}
        .lead{max-width:720px;margin:16px 0 0;color:#94a3b8;font-size:17px;line-height:1.7}
        .top-actions{display:flex;gap:12px;flex-wrap:wrap}
        .button{appearance:none;border:0;text-decoration:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 18px;border-radius:15px;font-weight:900;font-size:14px;transition:.2s ease}
        .button:hover{transform:translateY(-1px)}
        .button-primary{color:white;background:linear-gradient(135deg,#38bdf8,#6366f1);box-shadow:0 16px 40px rgba(56,189,248,.17)}
        .button-secondary{color:#e2e8f0;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10)}
        .button-danger{color:#fecaca;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.22)}
        .notice{margin-top:26px;padding:17px 20px;border-radius:18px;font-weight:800}
        .notice-success{color:#bbf7d0;background:rgba(34,197,94,.11);border:1px solid rgba(34,197,94,.24)}
        .notice-error{color:#fecaca;background:rgba(239,68,68,.11);border:1px solid rgba(239,68,68,.24)}
        .stats{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:14px;margin-top:34px}
        .stat{position:relative;overflow:hidden;min-height:142px;padding:22px;border-radius:24px;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.09);box-shadow:0 24px 70px rgba(0,0,0,.18)}
        .stat:after{content:"";position:absolute;width:120px;height:120px;border-radius:999px;right:-52px;bottom:-66px;background:rgba(255,255,255,.05)}
        .stat-label{display:block;color:#94a3b8;font-size:11px;font-weight:900;letter-spacing:.10em;text-transform:uppercase}
        .stat-value{display:block;margin-top:24px;font-size:32px;line-height:1;font-weight:950;letter-spacing:-.04em}
        .stat-note{display:block;margin-top:11px;color:#64748b;font-size:12px}
        .toolbar{display:grid;grid-template-columns:minmax(0,1fr) 220px auto auto;gap:12px;margin-top:26px;padding:18px;border-radius:24px;background:rgba(15,23,42,.78);border:1px solid rgba(255,255,255,.09);backdrop-filter:blur(18px)}
        .field{width:100%;min-height:48px;padding:0 15px;border-radius:14px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.055);color:#f8fafc;outline:none}
        .field::placeholder{color:#64748b}
        .field:focus{border-color:rgba(56,189,248,.55);box-shadow:0 0 0 4px rgba(56,189,248,.08)}
        select.field option{color:#0f172a}
        .result-line{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:28px 2px 13px;color:#94a3b8;font-size:13px}
        .table-card{overflow:hidden;border-radius:28px;background:rgba(10,20,36,.86);border:1px solid rgba(255,255,255,.09);box-shadow:0 35px 100px rgba(0,0,0,.28)}
        .table-wrap{overflow-x:auto}
        table{width:100%;border-collapse:collapse;min-width:1120px}
        th{padding:16px 18px;text-align:left;color:#64748b;font-size:11px;letter-spacing:.10em;text-transform:uppercase;background:rgba(255,255,255,.025);border-bottom:1px solid rgba(255,255,255,.08)}
        td{padding:17px 18px;border-bottom:1px solid rgba(255,255,255,.065);vertical-align:middle}
        tr:last-child td{border-bottom:0}
        tbody tr{transition:.2s ease}
        tbody tr:hover{background:rgba(56,189,248,.035)}
        .provider-cell{display:flex;align-items:center;gap:13px;min-width:250px}
        .avatar{flex:0 0 auto;width:44px;height:44px;border-radius:15px;display:grid;place-items:center;font-weight:950;background:linear-gradient(135deg,rgba(56,189,248,.42),rgba(99,102,241,.42));border:1px solid rgba(255,255,255,.12)}
        .provider-name{font-weight:900;color:#f8fafc}
        .provider-sub{margin-top:4px;color:#64748b;font-size:12px}
        .status{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border-radius:999px;font-size:11px;font-weight:900;white-space:nowrap}
        .status:before{content:"";width:7px;height:7px;border-radius:999px}
        .status-approved{color:#bbf7d0;background:rgba(34,197,94,.10);border:1px solid rgba(34,197,94,.20)}
        .status-approved:before{background:#22c55e}
        .status-pending{color:#fde68a;background:rgba(250,204,21,.10);border:1px solid rgba(250,204,21,.20)}
        .status-pending:before{background:#facc15}
        .status-blocked{color:#fecaca;background:rgba(239,68,68,.10);border:1px solid rgba(239,68,68,.20)}
        .status-blocked:before{background:#ef4444}
        .credit{font-weight:950;color:#fde68a}
        .muted{color:#94a3b8;font-size:13px}
        .row-actions{display:flex;gap:8px;align-items:center;justify-content:flex-end}
        .mini{min-height:37px;padding:0 12px;border-radius:11px;font-size:12px}
        details.provider-details{border-top:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.018)}
        details.provider-details>summary{list-style:none;cursor:pointer;padding:15px 20px;color:#bae6fd;font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;gap:8px}
        details.provider-details>summary::-webkit-details-marker{display:none}
        details.provider-details[open]>summary{border-bottom:1px solid rgba(255,255,255,.08)}
        .detail-grid{display:grid;grid-template-columns:330px minmax(0,1fr);gap:20px;padding:22px}
        .panel{padding:20px;border-radius:22px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}
        .panel h3{margin:0 0 16px;font-size:16px}
        .credit-number{font-size:48px;line-height:1;font-weight:950;letter-spacing:-.05em}
        .credit-actions{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:17px}
        .status-actions{display:grid;gap:9px;margin-top:17px;padding-top:17px;border-top:1px solid rgba(255,255,255,.08)}
        .meta{display:grid;gap:9px;margin-top:17px;padding-top:17px;border-top:1px solid rgba(255,255,255,.08);color:#94a3b8;font-size:13px}
        .edit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        .edit-grid textarea{grid-column:1/-1;min-height:120px;padding:14px;resize:vertical}
        .edit-grid .full{grid-column:1/-1}
        .danger-zone{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08)}
        .empty{padding:70px 24px;text-align:center;color:#94a3b8}
        @media(max-width:1180px){.stats{grid-template-columns:repeat(4,minmax(0,1fr))}.detail-grid{grid-template-columns:1fr}.toolbar{grid-template-columns:1fr 200px auto}}
        @media(max-width:760px){.providers-page{padding-top:36px}.providers-shell{width:min(100% - 22px,1480px)}.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.toolbar{grid-template-columns:1fr}.top-actions{width:100%}.top-actions .button{flex:1}.detail-grid{padding:12px}.edit-grid{grid-template-columns:1fr}.edit-grid textarea,.edit-grid .full{grid-column:auto}.panel{padding:16px}}
      `}</style>

      <div className="providers-shell">
        <header className="topbar">
          <div>
            <span className="eyebrow">Auftrago Administration</span>
            <h1>Anbieter-Zentrale.</h1>
            <p className="lead">
              Anbieter prüfen, bearbeiten und steuern – kompakt wie in einem modernen CRM.
            </p>
          </div>

          <div className="top-actions">
            <Link href="/admin" className="button button-secondary">
              ← Dashboard
            </Link>
            <Link href="/admin/activity" className="button button-secondary">
              ⚡ Aktivitäten
            </Link>
            <Link href="/admin/leads" className="button button-primary">
              Leads verwalten
            </Link>
          </div>
        </header>

        {message === "approval-mail-sent" ? (
          <div className="notice notice-success">
            ✅ Freigabe-Mail wurde erfolgreich erneut gesendet.
          </div>
        ) : null}

        {error === "approval-mail-failed" ? (
          <div className="notice notice-error">
            ❌ Freigabe-Mail konnte nicht gesendet werden. Prüfe die Vercel-Logs.
          </div>
        ) : null}

        {error === "provider-not-found" ? (
          <div className="notice notice-error">❌ Anbieter wurde nicht gefunden.</div>
        ) : null}

        <section className="stats">
          <div className="stat"><span className="stat-label">Anbieter</span><strong className="stat-value">{totalProviders}</strong><span className="stat-note">Insgesamt registriert</span></div>
          <div className="stat"><span className="stat-label">Genehmigt</span><strong className="stat-value">{approvedCount}</strong><span className="stat-note">{approvalRate}% Freigabequote</span></div>
          <div className="stat"><span className="stat-label">Ausstehend</span><strong className="stat-value">{pendingCount}</strong><span className="stat-note">Noch zu prüfen</span></div>
          <div className="stat"><span className="stat-label">Gesperrt</span><strong className="stat-value">{blockedCount}</strong><span className="stat-note">Kein Portalzugriff</span></div>
          <div className="stat"><span className="stat-label">Credits</span><strong className="stat-value">{totalCredits}</strong><span className="stat-note">Aktuelle Kontostände</span></div>
          <div className="stat"><span className="stat-label">Leadkäufe</span><strong className="stat-value">{totalPurchases}</strong><span className="stat-note">Alle Anbieter</span></div>
          <div className="stat"><span className="stat-label">Umsatz</span><strong className="stat-value">{formatMoney(totalRevenue)}</strong><span className="stat-note">Bezahlte Creditpakete</span></div>
        </section>

        <form className="toolbar">
          <input className="field" name="q" defaultValue={q} placeholder="Firma, Kontakt, E-Mail, Telefon, Region oder Kategorie suchen …" />
          <select className="field" name="status" defaultValue={statusFilter}>
            <option value="ALL">Alle Status</option>
            <option value="PENDING">Ausstehend</option>
            <option value="APPROVED">Genehmigt</option>
            <option value="BLOCKED">Gesperrt</option>
          </select>
          <button type="submit" className="button button-primary">Suchen</button>
          <Link href="/admin/providers" className="button button-secondary">Zurücksetzen</Link>
        </form>

        <div className="result-line">
          <span>{providers.length} Anbieter angezeigt</span>
          <span>Sortiert nach letzter Aktualisierung</span>
        </div>

        <section className="table-card">
          {providers.length === 0 ? (
            <div className="empty">
              <h2>Keine Anbieter gefunden</h2>
              <p>Ändere deine Suche oder setze die Filter zurück.</p>
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Anbieter</th>
                      <th>Status</th>
                      <th>Region / Kategorie</th>
                      <th>Credits</th>
                      <th>Leadkäufe</th>
                      <th>Credit-Umsatz</th>
                      <th>Registriert</th>
                      <th style={{ textAlign: "right" }}>Schnellaktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((provider) => {
                      const creditRevenue = provider.creditPurchases
                        .filter((purchase) => purchase.status === "paid")
                        .reduce((sum, purchase) => sum + purchase.amount, 0);

                      return (
                        <tr key={provider.id}>
                          <td>
                            <div className="provider-cell">
                              <div className="avatar">{getInitials(provider.companyName)}</div>
                              <div>
                                <div className="provider-name">{provider.companyName}</div>
                                <div className="provider-sub">{provider.contactName} · {provider.email}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className={statusClass(provider.status)}>{statusLabel(provider.status)}</span></td>
                          <td><div className="muted">{provider.region || "Keine Region"}</div><div className="provider-sub">{provider.category || "Keine Kategorie"}</div></td>
                          <td><span className="credit">{provider.credits}</span></td>
                          <td><strong>{provider.purchases.length}</strong></td>
                          <td><strong>{formatMoney(creditRevenue)}</strong></td>
                          <td><span className="muted">{formatDate(provider.createdAt)}</span></td>
                          <td>
                            <div className="row-actions">
                              {provider.status !== "APPROVED" ? (
                                <form action={setStatus}>
                                  <input type="hidden" name="id" value={provider.id} />
                                  <input type="hidden" name="status" value="APPROVED" />
                                  <button className="button button-primary mini">Genehmigen</button>
                                </form>
                              ) : null}
                              <form action={addCredits}>
                                <input type="hidden" name="id" value={provider.id} />
                                <input type="hidden" name="amount" value="10" />
                                <button className="button button-secondary mini">+10 Credits</button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {providers.map((provider) => {
                const creditRevenue = provider.creditPurchases
                  .filter((purchase) => purchase.status === "paid")
                  .reduce((sum, purchase) => sum + purchase.amount, 0);

                return (
                  <details className="provider-details" key={`details-${provider.id}`}>
                    <summary>Details & Bearbeitung: {provider.companyName} ↓</summary>
                    <div className="detail-grid">
                      <aside className="panel">
                        <h3>Credits & Zugriff</h3>
                        <div className="credit-number">{provider.credits}</div>
                        <div className="provider-sub">Aktueller Credit-Kontostand</div>

                        <div className="credit-actions">
                          {[10, 25, 50, 100].map((amount) => (
                            <form key={amount} action={addCredits}>
                              <input type="hidden" name="id" value={provider.id} />
                              <input type="hidden" name="amount" value={amount} />
                              <button className="button button-primary mini" style={{ width: "100%" }}>+{amount}</button>
                            </form>
                          ))}
                          <form action={addCredits}>
                            <input type="hidden" name="id" value={provider.id} />
                            <input type="hidden" name="amount" value="-10" />
                            <button className="button button-secondary mini" style={{ width: "100%" }}>−10</button>
                          </form>
                          <form action={resetCredits}>
                            <input type="hidden" name="id" value={provider.id} />
                            <button className="button button-secondary mini" style={{ width: "100%" }}>Reset</button>
                          </form>
                        </div>

                        <div className="status-actions">
                          <form action={setStatus}>
                            <input type="hidden" name="id" value={provider.id} />
                            <input type="hidden" name="status" value="APPROVED" />
                            <button className="button button-primary" style={{ width: "100%" }}>🟢 Genehmigen</button>
                          </form>
                          <form action={resendApprovalMail}>
                            <input type="hidden" name="id" value={provider.id} />
                            <button className="button button-secondary" style={{ width: "100%" }}>📧 Freigabe-Mail senden</button>
                          </form>
                          <form action={setStatus}>
                            <input type="hidden" name="id" value={provider.id} />
                            <input type="hidden" name="status" value="BLOCKED" />
                            <button className="button button-danger" style={{ width: "100%" }}>🔴 Anbieter sperren</button>
                          </form>
                        </div>

                        <SetProviderPassword providerId={provider.id} />

                        <div className="meta">
                          <div>📦 Leadkäufe: {provider.purchases.length}</div>
                          <div>💳 Credit-Umsatz: {formatMoney(creditRevenue)}</div>
                          <div>📅 Registriert: {formatDate(provider.createdAt)}</div>
                          <div>🕘 Aktualisiert: {formatDate(provider.updatedAt)}</div>
                        </div>
                      </aside>

                      <section className="panel">
                        <h3>Anbieterdaten bearbeiten</h3>
                        <form action={updateProvider} className="edit-grid">
                          <input type="hidden" name="id" value={provider.id} />
                          <input className="field" name="companyName" defaultValue={provider.companyName} placeholder="Firmenname" required />
                          <input className="field" name="contactName" defaultValue={provider.contactName} placeholder="Kontaktperson" required />
                          <input className="field" name="email" type="email" defaultValue={provider.email} placeholder="E-Mail" required />
                          <input className="field" name="phone" defaultValue={provider.phone || ""} placeholder="Telefon" />
                          <input className="field" name="website" defaultValue={provider.website || ""} placeholder="Website" />
                          <input className="field" name="region" defaultValue={provider.region || ""} placeholder="Region" />
                          <input className="field" name="category" defaultValue={provider.category || ""} placeholder="Kategorie / Dienstleistung" />
                          <input className="field" name="city" defaultValue={provider.city || ""} placeholder="Ort" />
                          <input className="field" name="credits" type="number" min="0" defaultValue={provider.credits} placeholder="Credits" />
                          <select className="field" name="status" defaultValue={provider.status}>
                            <option value="PENDING">Ausstehend</option>
                            <option value="APPROVED">Genehmigt</option>
                            <option value="BLOCKED">Gesperrt</option>
                          </select>
                          <textarea className="field" name="description" defaultValue={provider.description || ""} placeholder="Interne Notizen / Beschreibung" />
                          <button type="submit" className="button button-primary full">💾 Änderungen speichern</button>
                        </form>

                        <div className="danger-zone">
                          <div><strong>Gefahrenzone</strong><div className="provider-sub">Das Löschen eines Anbieters kann nicht rückgängig gemacht werden.</div></div>
                          <form action={deleteProvider}>
                            <input type="hidden" name="id" value={provider.id} />
                            <button type="submit" className="button button-danger">🗑 Anbieter löschen</button>
                          </form>
                        </div>
                      </section>
                    </div>
                  </details>
                );
              })}
            </>
          )}
        </section>
      </div>
    </main>
  );
}