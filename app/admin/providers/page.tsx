import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ProviderStatus = "PENDING" | "APPROVED" | "BLOCKED";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  if (status === "APPROVED") return "🟢 Genehmigt";
  if (status === "BLOCKED") return "🔴 Gesperrt";
  return "🟡 Ausstehend";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
    data: {
      credits: Math.max(0, provider.credits + amount),
    },
  });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
}

async function setStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "PENDING") as ProviderStatus;

  await prisma.provider.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/anbieter");
}

async function resetCredits(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  await prisma.provider.update({
    where: { id },
    data: { credits: 0 },
  });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
}

async function deleteProvider(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  await prisma.provider.delete({
    where: { id },
  });

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
  };
}) {
  const q = String(searchParams?.q || "").trim();
  const statusFilter = String(searchParams?.status || "ALL").trim();

  const providers = await prisma.provider.findMany({
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
    include: {
      purchases: true,
      creditPurchases: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const allProviders = await prisma.provider.findMany({
    include: {
      purchases: true,
      creditPurchases: true,
    },
  });

  const totalProviders = allProviders.length;
  const pendingCount = allProviders.filter((p) => p.status === "PENDING").length;
  const approvedCount = allProviders.filter((p) => p.status === "APPROVED").length;
  const blockedCount = allProviders.filter((p) => p.status === "BLOCKED").length;
  const totalCredits = allProviders.reduce((sum, p) => sum + p.credits, 0);
  const totalPurchases = allProviders.reduce((sum, p) => sum + p.purchases.length, 0);
  const totalRevenue = allProviders.reduce(
    (sum, p) => sum + p.creditPurchases.reduce((s, c) => s + c.amount, 0),
    0
  );

  return (
    <main className="page">
      <section className="admin-dashboard">
        <div className="container">
          <span className="eyebrow">Admin</span>

          <div className="admin-head">
            <div>
              <h1>Anbieter verwalten</h1>
              <p>Premium-Verwaltung für Anbieter, Credits, Status und interne Notizen.</p>
            </div>

            <div className="admin-actions">
              <Link href="/admin" className="btn btn-secondary">
                Zurück
              </Link>

              <Link href="/admin/leads" className="btn btn-primary">
                Leads verwalten
              </Link>
            </div>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <strong>{totalProviders}</strong>
              <span>👥 Anbieter</span>
            </div>

            <div className="admin-stat-card">
              <strong>{approvedCount}</strong>
              <span>🟢 Genehmigt</span>
            </div>

            <div className="admin-stat-card">
              <strong>{pendingCount}</strong>
              <span>🟡 Ausstehend</span>
            </div>

            <div className="admin-stat-card">
              <strong>{blockedCount}</strong>
              <span>🔴 Gesperrt</span>
            </div>

            <div className="admin-stat-card">
              <strong>{totalCredits}</strong>
              <span>💰 Credits</span>
            </div>

            <div className="admin-stat-card">
              <strong>{totalPurchases}</strong>
              <span>📦 Leadkäufe</span>
            </div>

            <div className="admin-stat-card">
              <strong>{totalRevenue}</strong>
              <span>💳 Umsatz</span>
            </div>
          </div>

          <section
            className="admin-card admin-card-wide"
            style={{
              marginBottom: 28,
              borderRadius: 34,
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,64,112,0.76))",
              boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
            }}
          >
            <div className="admin-card-head">
              <span>Suche & Filter</span>
              <h2>Anbieter finden</h2>
            </div>

            <form
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 220px auto",
                gap: 14,
                alignItems: "center",
              }}
            >
              <input
                name="q"
                defaultValue={q}
                placeholder="Firma, Kontakt, E-Mail, Telefon, Region oder Kategorie suchen..."
              />

              <select name="status" defaultValue={statusFilter}>
                <option value="ALL">Alle Status</option>
                <option value="PENDING">Ausstehend</option>
                <option value="APPROVED">Genehmigt</option>
                <option value="BLOCKED">Gesperrt</option>
              </select>

              <button type="submit" className="btn btn-primary">
                Suchen
              </button>
            </form>
          </section>

          <div style={{ display: "grid", gap: 28 }}>
            {providers.map((provider) => {
              const creditRevenue = provider.creditPurchases.reduce(
                (sum, c) => sum + c.amount,
                0
              );

              return (
                <article
                  key={provider.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 38,
                    padding: 30,
                    background:
                      "radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 35%), linear-gradient(135deg, rgba(15,23,42,0.99), rgba(30,41,59,0.92))",
                    boxShadow: "0 35px 100px rgba(0,0,0,0.40)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 24,
                      flexWrap: "wrap",
                      marginBottom: 26,
                    }}
                  >
                    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                      <div
                        style={{
                          width: 76,
                          height: 76,
                          borderRadius: 26,
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 900,
                          fontSize: 24,
                          background:
                            "linear-gradient(135deg, rgba(56,189,248,0.55), rgba(99,102,241,0.35))",
                          border: "1px solid rgba(255,255,255,0.16)",
                          boxShadow: "0 18px 45px rgba(56,189,248,0.18)",
                        }}
                      >
                        {getInitials(provider.companyName)}
                      </div>

                      <div>
                        <h2 style={{ margin: 0, fontSize: 30 }}>
                          {provider.companyName}
                        </h2>

                        <p style={{ margin: "8px 0 0", opacity: 0.76 }}>
                          👤 {provider.contactName} · 📧 {provider.email}
                        </p>

                        <p style={{ margin: "6px 0 0", opacity: 0.62 }}>
                          📍 {provider.region || "Keine Region"} · 🧹{" "}
                          {provider.category || "Keine Kategorie"}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <div
                        style={{
                          padding: "14px 18px",
                          borderRadius: 999,
                          background: "rgba(250,204,21,0.12)",
                          border: "1px solid rgba(250,204,21,0.25)",
                          fontWeight: 900,
                        }}
                      >
                        💰 {provider.credits} Credits
                      </div>

                      <div
                        style={{
                          padding: "14px 18px",
                          borderRadius: 999,
                          background:
                            provider.status === "APPROVED"
                              ? "rgba(34,197,94,0.12)"
                              : provider.status === "BLOCKED"
                              ? "rgba(239,68,68,0.12)"
                              : "rgba(250,204,21,0.12)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          fontWeight: 900,
                        }}
                      >
                        {statusLabel(provider.status)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "360px 1fr",
                      gap: 24,
                    }}
                  >
                    <section
                      style={{
                        borderRadius: 30,
                        padding: 24,
                        background: "rgba(255,255,255,0.045)",
                        border: "1px solid rgba(255,255,255,0.09)",
                      }}
                    >
                      <h3 style={{ marginTop: 0 }}>💰 Credits verwalten</h3>

                      <div style={{ fontSize: 54, fontWeight: 950, lineHeight: 1 }}>
                        {provider.credits}
                      </div>

                      <p style={{ opacity: 0.6, marginTop: 8 }}>Aktueller Kontostand</p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                          marginTop: 20,
                        }}
                      >
                        {[10, 25, 50, 100].map((amount) => (
                          <form key={amount} action={addCredits}>
                            <input type="hidden" name="id" value={provider.id} />
                            <input type="hidden" name="amount" value={amount} />
                            <button className="btn btn-primary" style={{ width: "100%" }}>
                              +{amount}
                            </button>
                          </form>
                        ))}

                        <form action={addCredits}>
                          <input type="hidden" name="id" value={provider.id} />
                          <input type="hidden" name="amount" value="-10" />
                          <button className="btn btn-secondary" style={{ width: "100%" }}>
                            -10
                          </button>
                        </form>

                        <form action={resetCredits}>
                          <input type="hidden" name="id" value={provider.id} />
                          <button className="btn btn-secondary" style={{ width: "100%" }}>
                            Reset
                          </button>
                        </form>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 12,
                          marginTop: 22,
                          paddingTop: 18,
                          borderTop: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <form action={setStatus}>
                          <input type="hidden" name="id" value={provider.id} />
                          <input type="hidden" name="status" value="APPROVED" />
                          <button className="btn btn-primary" style={{ width: "100%" }}>
                            🟢 Anbieter genehmigen
                          </button>
                        </form>

                        <form action={setStatus}>
                          <input type="hidden" name="id" value={provider.id} />
                          <input type="hidden" name="status" value="BLOCKED" />
                          <button className="btn btn-secondary" style={{ width: "100%" }}>
                            🔴 Anbieter sperren
                          </button>
                        </form>
                      </div>

                      <div
                        style={{
                          marginTop: 22,
                          display: "grid",
                          gap: 10,
                          fontSize: 14,
                          opacity: 0.75,
                        }}
                      >
                        <div>📦 Leadkäufe: {provider.purchases.length}</div>
                        <div>💳 Credit-Umsatz: {creditRevenue} CHF</div>
                        <div>
                          📅 Registriert:{" "}
                          {new Intl.DateTimeFormat("de-CH").format(provider.createdAt)}
                        </div>
                      </div>
                    </section>

                    <form action={updateProvider}>
                      <div
                        style={{
                          display: "grid",
                          gap: 14,
                        }}
                      >
                        <input type="hidden" name="id" value={provider.id} />

                        <div className="form-row">
                          <input
                            name="companyName"
                            defaultValue={provider.companyName}
                            placeholder="🏢 Firmenname"
                            required
                          />

                          <input
                            name="contactName"
                            defaultValue={provider.contactName}
                            placeholder="👤 Kontaktperson"
                            required
                          />
                        </div>

                        <div className="form-row">
                          <input
                            name="email"
                            type="email"
                            defaultValue={provider.email}
                            placeholder="📧 E-Mail"
                            required
                          />

                          <input
                            name="phone"
                            defaultValue={provider.phone || ""}
                            placeholder="📱 Telefon"
                          />
                        </div>

                        <div className="form-row">
                          <input
                            name="website"
                            defaultValue={provider.website || ""}
                            placeholder="🌍 Website"
                          />

                          <input
                            name="region"
                            defaultValue={provider.region || ""}
                            placeholder="📍 Region"
                          />
                        </div>

                        <div className="form-row">
                          <input
                            name="category"
                            defaultValue={provider.category || ""}
                            placeholder="🧹 Kategorie / Dienstleistung"
                          />

                          <input
                            name="city"
                            defaultValue={provider.city || ""}
                            placeholder="🏙 Ort"
                          />
                        </div>

                        <div className="form-row">
                          <input
                            name="credits"
                            type="number"
                            min="0"
                            defaultValue={provider.credits}
                            placeholder="💰 Credits manuell"
                          />

                          <select name="status" defaultValue={provider.status}>
                            <option value="PENDING">🟡 Ausstehend</option>
                            <option value="APPROVED">🟢 Genehmigt</option>
                            <option value="BLOCKED">🔴 Gesperrt</option>
                          </select>
                        </div>

                        <textarea
                          name="description"
                          defaultValue={provider.description || ""}
                          placeholder="📝 Interne Notizen / Beschreibung"
                          style={{ minHeight: 135 }}
                        />

                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ width: "100%", marginTop: 6 }}
                        >
                          💾 Änderungen speichern
                        </button>
                      </div>
                    </form>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      flexWrap: "wrap",
                      marginTop: 24,
                      paddingTop: 20,
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <small style={{ opacity: 0.55 }}>
                      Erstellt:{" "}
                      {new Intl.DateTimeFormat("de-CH").format(provider.createdAt)} ·
                      Aktualisiert:{" "}
                      {new Intl.DateTimeFormat("de-CH").format(provider.updatedAt)}
                    </small>

                    <form action={deleteProvider}>
                      <input type="hidden" name="id" value={provider.id} />
                      <button
                        type="submit"
                        className="btn btn-secondary"
                        style={{
                          borderColor: "rgba(255,80,80,0.35)",
                          color: "#ffb4b4",
                        }}
                      >
                        🗑 Anbieter löschen
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}