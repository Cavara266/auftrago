import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const providers = await prisma.provider.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container-app section-space">
      <h1 className="text-5xl font-bold text-white mb-10">
        Admin Anbieter
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left text-white/60 py-4 px-3">
                Firma
              </th>

              <th className="text-left text-white/60 py-4 px-3">
                Kontakt
              </th>

              <th className="text-left text-white/60 py-4 px-3">
                E-Mail
              </th>

              <th className="text-left text-white/60 py-4 px-3">
                Telefon
              </th>

              <th className="text-left text-white/60 py-4 px-3">
                Region
              </th>

              <th className="text-left text-white/60 py-4 px-3">
                Leistung
              </th>
            </tr>
          </thead>

          <tbody>
            {providers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-white/50"
                >
                  Keine Anbieter vorhanden
                </td>
              </tr>
            ) : (
              providers.map((provider) => (
                <tr
                  key={provider.id}
                  className="border-b border-white/10"
                >
                  <td className="py-4 px-3 text-white">
                    {provider.companyName}
                  </td>

                  <td className="py-4 px-3 text-white">
                    {provider.contactName}
                  </td>

                  <td className="py-4 px-3 text-white">
                    {provider.email}
                  </td>

                  <td className="py-4 px-3 text-white">
                    {provider.phone || "-"}
                  </td>

                  <td className="py-4 px-3 text-white">
                    {provider.region || "-"}
                  </td>

                  <td className="py-4 px-3 text-white">
                    {provider.category || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}