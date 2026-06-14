import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">E-Mail</th>
              <th className="p-3">Telefon</th>
              <th className="p-3">Kategorie</th>
              <th className="p-3">Region</th>
              <th className="p-3">Beschreibung</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t">
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.category}</td>
                <td className="p-3">{lead.region}</td>
                <td className="p-3 max-w-md">{lead.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}