import { prisma } from "@/lib/db";

export default async function Page() {
  const providers = await prisma.provider.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container-app section-space">
      <h1 className="text-3xl text-white mb-10">Admin Anbieter</h1>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="text-white/60">Firma</th>
            <th className="text-white/60">Kontakt</th>
            <th className="text-white/60">E-Mail</th>
            <th className="text-white/60">Telefon</th>
            <th className="text-white/60">Region</th>
            <th className="text-white/60">Leistung</th>
          </tr>
        </thead>

        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.companyName}</td>
              <td>{provider.contactName}</td>
              <td>{provider.email}</td>
              <td>{provider.phone || "-"}</td>
              <td>{provider.region || "-"}</td>
              <td>{provider.category || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}