import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ProviderStatus = "PENDING" | "APPROVED" | "BLOCKED";

export const dynamic = "force-dynamic";

function getStatusLabel(status: ProviderStatus) {
  if (status === "APPROVED") return "Genehmigt";
  if (status === "BLOCKED") return "Gesperrt";
  return "Ausstehend";
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
  const credits = Number(formData.get("credits") || 0);
  const description = String(formData.get("description") || "").trim();
  const status = String(formData.get("status") || "PENDING") as ProviderStatus;

  if (!id || !companyName || !contactName || !email) {
    throw new Error("Pflichtfelder fehlen.");
  }

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

  revalidatePath("/admin");
  revalidatePath("/admin/providers");
  revalidatePath("/anbieter");
}

async function addCredits(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const amount = Number(formData.get("amount") || 0);

  if (!id) throw new Error("Anbieter fehlt.");

  await prisma.provider.update({
    where: { id },
    data: {
      credits: {
        increment: amount,
      },
    },
  });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
}

async function resetCredits(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  if (!id) throw new Error("Anbieter fehlt.");

  await prisma.provider.update({
    where: { id },
    data: {
      credits: 0,
    },
  });

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
}

async function deleteProvider(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  if (!id) throw new Error("Anbieter fehlt.");

  await prisma.provider.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/providers");
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
    orderBy: { updatedAt: "desc" },
  });

  const allProviders = await prisma.provider.findMany({
    select: {
      status: true,
      credits: true,
    },
  });

  const totalProviders = allProviders.length;
  const pendingCount = allProviders.filter((p) => p.status === "PENDING").length;
  const approvedCount = allProviders.filter((p) => p.status === "APPROVED").length;
  const blockedCount = allProviders.filter((p) => p.status === "BLOCKED").length;
  const totalCredits = allProviders.reduce((sum, p) => sum + p.credits, 0);

  return (
    <main className="page">
      <section className="admin-dashboard">
        <div className="container">
          <span className="eyebrow">Admin</span>

          <div className="admin-head">
            <div>
              <h1>Anbieter verwalten</h1>
              <p>Firmen prüfen, Credits vergeben, Status ändern und Anbieter bearbeiten.</p>
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
              <span>Anbieter gesamt</span>
            </div>

            <div className="admin-stat-card">
              <strong>{pendingCount}</strong>
              <span>Ausstehend</span>
            </div>

            <div className="admin-stat-card">
              <strong>{approvedCount}</strong>
              <span>Genehmigt</span>
            </div>

            <div className="admin-stat-card">
              <strong>{blockedCount}</strong>
              <span>Gesperrt</span>
            </div>

            <div className="admin-stat-card">
              <strong>{totalCredits}</strong>
              <span>Credits gesamt</span>
            </div>
          </div>

          <section
            className="admin-card admin-card-wide"
            style={{
              marginBottom: 26,
              borderRadius: 30,
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))",
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
                placeholder="Firma, E-Mail, Telefon, Region oder Kategorie suchen..."
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

          <div style={{ display: "grid", gap: 24 }}>
            {providers.length === 0 ? (
              <section className="admin-card">
                <p className="admin-empty">Keine Anbieter gefunden.</p>
              </section>
            ) : (
              providers.map((provider) => (
                <article
                  key={provider.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 34,
                    padding: 28,
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.9))",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 24,
                      flexWrap: "wrap",
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                      <div
                        style={{
                          width: 66,
                          height: 66,
                          borderRadius: 22,
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 900,
                          fontSize: 22,
                          background:
                            "linear-gradient(135deg, rgba(59,130,246,0.45), rgba(14,165,233,0.2))",
                          border: "1px solid rgba(255,255,255,0.14)",
                        }}
                      >
                        {getInitials(provider.companyName)}
                      </div>

                      <div>
                        <h2 style={{ margin: 0, fontSize: 28 }}>
                          {provider.companyName}
                        </h2>
                        <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
                          {provider.contactName} · {provider.email}
                        </p>
                        <p style={{ margin: "4px 0 0", opacity: 0.6 }}>
                          {provider.region || "Keine Region"} ·{" "}
                          {provider.category || "Keine Kategorie"}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span className="admin-pill">
                        {provider.credits} Credits
                      </span>

                      <span className="admin-pill">
                        {getStatusLabel(provider.status)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.3fr",
                      gap: 22,
                    }}
                  >
                    <section
                      style={{
                        borderRadius: 26,
                        padding: 22,
                        background: "rgba(255,255,255,0.045)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <h3 style={{ marginTop: 0 }}>Credits</h3>

                      <div
                        style={{
                          fontSize: 46,
                          fontWeight: 900,
                          marginBottom: 16,
                        }}
                      >
                        {provider.credits}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
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
                    </section>

                    <form action={updateProvider}>
                      <input type="hidden" name="id" value={provider.id} />

                      <div className="form-row">
                        <input
                          name="companyName"
                          defaultValue={provider.companyName}
                          placeholder="Firmenname"
                          required
                        />

                        <input
                          name="contactName"
                          defaultValue={provider.contactName}
                          placeholder="Kontaktperson"
                          required
                        />
                      </div>

                      <div className="form-row">
                        <input
                          name="email"
                          type="email"
                          defaultValue={provider.email}
                          placeholder="E-Mail"
                          required
                        />

                        <input
                          name="phone"
                          defaultValue={provider.phone || ""}
                          placeholder="Telefon"
                        />
                      </div>

                      <div className="form-row">
                        <input
                          name="website"
                          defaultValue={provider.website || ""}
                          placeholder="Website"
                        />

                        <input
                          name="region"
                          defaultValue={provider.region || ""}
                          placeholder="Region"
                        />
                      </div>

                      <div className="form-row">
                        <input
                          name="category"
                          defaultValue={provider.category || ""}
                          placeholder="Dienstleistung"
                        />

                        <input
                          name="city"
                          defaultValue={provider.city || ""}
                          placeholder="Ort"
                        />
                      </div>

                      <div className="form-row">
                        <input
                          name="credits"
                          type="number"
                          min="0"
                          defaultValue={provider.credits}
                          placeholder="Credits manuell"
                        />

                        <select name="status" defaultValue={provider.status}>
                          <option value="PENDING">Ausstehend</option>
                          <option value="APPROVED">Genehmigt</option>
                          <option value="BLOCKED">Gesperrt</option>
                        </select>
                      </div>

                      <textarea
                        name="description"
                        defaultValue={provider.description || ""}
                        placeholder="Beschreibung / interne Notizen"
                        style={{ minHeight: 115 }}
                      />

                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: 16, width: "100%" }}
                      >
                        Änderungen speichern
                      </button>
                    </form>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      flexWrap: "wrap",
                      marginTop: 22,
                      paddingTop: 18,
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
                        Anbieter löschen
                      </button>
                    </form>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}