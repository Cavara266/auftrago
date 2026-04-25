import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {

  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <main className="container-app section-space">

      <h1 className="text-4xl font-bold text-white mb-10">
        Anbieter Dashboard
      </h1>

      <div className="glass-card p-6">

        <table className="w-full text-left">

          <thead className="text-white/50 text-sm">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Service</th>
              <th className="pb-3">Stadt</th>
              <th className="pb-3">Datum</th>
            </tr>
          </thead>

          <tbody className="text-white/80">

            {leads.map((lead) => (

              <tr
                key={lead.id}
                className="border-t border-white/10"
              >

                <td className="py-3">
                  {lead.name}
                </td>

                <td className="py-3">
                  {lead.email}
                </td>

                <td className="py-3">
                  {lead.service}
                </td>

                <td className="py-3">
                  {lead.city}
                </td>

                <td className="py-3">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  )
}