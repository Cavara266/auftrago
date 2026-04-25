import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">E-Mail</th>
            <th className="p-3">Telefon</th>
            <th className="p-3">Service</th>
            <th className="p-3">Ort</th>
            <th className="p-3">Beschreibung</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t">
              <td className="p-3">{lead.name}</td>
              <td className="p-3">{lead.email}</td>
              <td className="p-3">{lead.phone}</td>

              {/* 🔥 FIX: category statt service */}
              <td className="p-3">{lead.category}</td>

              <td className="p-3">{lead.region}</td>
              <td className="p-3">{lead.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}