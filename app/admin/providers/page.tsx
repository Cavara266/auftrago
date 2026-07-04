import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function updateProvider(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const companyName = String(formData.get("companyName") || "").trim();
  const contactName = String(formData.get("contactName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const credits = Number(formData.get("credits") || 0);
  const description = String(formData.get("description") || "").trim();

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
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/providers");
  revalidatePath("/anbieter");
}

async function deleteProvider(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Anbieter-ID fehlt.");
  }

  await prisma.provider.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/providers");
  revalidatePath("/anbieter");
}

export default async function AdminProvidersPage() {
  const providers = await prisma.provider.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="page">
      <section className="admin-dashboard">
        <div className="container">
          <span className="eyebrow">Admin</span>

          <div className="admin-head">
            <div>
              <h1>Anbieter verwalten</h1>
              <p>Firmen bearbeiten, Credits vergeben und Anbieter löschen.</p>
            </div>

            <div className="admin-actions">
              <Link href="/admin" className="btn btn-secondary">
                Zurück zum Admin
              </Link>

              <Link href="/admin/leads" className="btn btn-primary">
                Leads verwalten
              </Link>
            </div>
          </div>

          <section className="admin-card admin-card-wide">
            <div className="admin-card-head">
              <span>Alle Anbieter</span>
              <h2>{providers.length} Anbieter</h2>
            </div>

            <div style={{ display: "grid", gap: 24 }}>
              {providers.length === 0 ? (
                <p className="admin-empty">Noch keine Anbieter vorhanden.</p>
              ) : (
                providers.map((provider) => (
                  <article
                    key={provider.id}
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 28,
                      padding: 26,
                      background:
                        "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.78))",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 20,
                        alignItems: "flex-start",
                        marginBottom: 22,
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: 28, marginBottom: 6 }}>
                          {provider.companyName}
                        </h3>

                        <p style={{ opacity: 0.75, margin: 0 }}>
                          {provider.contactName} · {provider.email}
                        </p>
                      </div>

                      <div className="admin-pill">
                        {provider.credits} Credits
                      </div>
                    </div>

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
                          placeholder="Dienstleistung / Kategorie"
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
                          placeholder="Credits"
                        />

                        <input
                          value={new Intl.DateTimeFormat("de-CH").format(
                            provider.createdAt
                          )}
                          readOnly
                          placeholder="Erstellt am"
                        />
                      </div>

                      <textarea
                        name="description"
                        defaultValue={provider.description || ""}
                        placeholder="Beschreibung / interne Notizen"
                        style={{ minHeight: 130 }}
                      />

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 14,
                          marginTop: 18,
                          flexWrap: "wrap",
                        }}
                      >
                        <button type="submit" className="btn btn-primary">
                          Änderungen speichern
                        </button>
                      </div>
                    </form>

                    <form action={deleteProvider} style={{ marginTop: 14 }}>
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
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}