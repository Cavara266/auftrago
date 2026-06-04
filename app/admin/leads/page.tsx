import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createLeadAction(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price") || 0);

  if (!title || !description || !name || !email || !phone || !region || !category || !price) {
    return;
  }

  await prisma.lead.create({
    data: {
      title,
      description,
      name,
      email,
      phone,
      region,
      category,
      price,
    },
  });

  redirect("/admin/leads");
}

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container-app section-space">
      <div className="mb-10">
        <span className="eyebrow">Admin</span>

        <h1 className="text-5xl font-bold text-white mt-4">
          Leads verwalten
        </h1>

        <p className="text-white/60 mt-4 max-w-2xl">
          Erstelle neue Kundenanfragen. Diese erscheinen danach automatisch im
          Anbieter-Portal unter Neue Leads.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          action={createLeadAction}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 grid gap-4"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Neuen Lead erstellen
          </h2>

          <input
            name="title"
            className="input"
            placeholder="Titel z.B. Umzugsreinigung 4.5 Zimmer"
            required
          />

          <textarea
            name="description"
            className="input min-h-[120px]"
            placeholder="Beschreibung des Auftrags"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              className="input"
              placeholder="Kundenname"
              required
            />

            <input
              name="phone"
              className="input"
              placeholder="Telefon"
              required
            />
          </div>

          <input
            name="email"
            type="email"
            className="input"
            placeholder="E-Mail"
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <input
              name="region"
              className="input"
              placeholder="Region z.B. Zürich"
              required
            />

            <input
              name="category"
              className="input"
              placeholder="Kategorie z.B. Reinigung"
              required
            />

            <input
              name="price"
              type="number"
              min="1"
              className="input"
              placeholder="Preis Credits"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2">
            Lead erstellen
          </button>
        </form>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Bestehende Leads
          </h2>

          <div className="grid gap-4">
            {leads.length === 0 ? (
              <p className="text-white/50">
                Noch keine Leads vorhanden.
              </p>
            ) : (
              leads.map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
                          {lead.category}
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
                          {lead.region}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white">
                        {lead.title}
                      </h3>

                      <p className="text-white/60 mt-2">
                        {lead.description}
                      </p>

                      <p className="text-white/50 mt-3 text-sm">
                        Kontakt: {lead.name} · {lead.email} · {lead.phone}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-white/50 text-sm">
                        Preis
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {lead.price} Credits
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}