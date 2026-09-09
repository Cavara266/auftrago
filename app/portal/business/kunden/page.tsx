import Link from "next/link";

const customers = [
  { name: "Muster Immobilien AG", contact: "Thomas Müller", email: "info@muster.ch", city: "Zürich", jobs: 4, revenue: "CHF 6'840.–" },
  { name: "Sandra Keller", contact: "Privatkunde", email: "sandra.keller@example.ch", city: "Baden", jobs: 2, revenue: "CHF 2'190.–" },
  { name: "Meier Verwaltung GmbH", contact: "Laura Meier", email: "verwaltung@example.ch", city: "Aarau", jobs: 7, revenue: "CHF 11'420.–" },
];

export default function KundenPage() {
  return (
    <main style={{
      minHeight: "100vh",
      padding: 36,
      color: "#fff",
      background: "radial-gradient(circle at 90% 0%,rgba(124,58,237,.16),transparent 26%),#06101f"
    }}>
      <div style={{maxWidth: 1400, margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"center",flexWrap:"wrap"}}>
          <div>
            <div style={{color:"#38bdf8",fontSize:12,fontWeight:900}}>AUFTRAGO BUSINESS / CRM</div>
            <h1 style={{fontSize:42,margin:"8px 0 6px"}}>Kunden</h1>
            <p style={{color:"#91a0b7",margin:0}}>Alle Kunden, Kontakte, Aufträge und Umsätze an einem Ort.</p>
          </div>

          <Link href="/portal/business/kunden/neu" style={{
            textDecoration:"none",
            color:"#fff",
            padding:"13px 18px",
            borderRadius:12,
            fontWeight:800,
            background:"linear-gradient(90deg,#0ea5e9,#7c3aed)"
          }}>
            + Neuer Kunde
          </Link>
        </div>

        <section style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
          gap:14,
          margin:"28px 0"
        }}>
          {[
            ["3","Kunden"],
            ["13","Aufträge gesamt"],
            ["CHF 20'450.–","Kundenumsatz"],
            ["CHF 6'817.–","Ø Umsatz / Kunde"]
          ].map(([value,label]) => (
            <div key={label} style={{
              padding:20,
              borderRadius:18,
              border:"1px solid rgba(148,163,184,.14)",
              background:"rgba(12,27,49,.9)"
            }}>
              <div style={{fontSize:25,fontWeight:900}}>{value}</div>
              <div style={{color:"#8291a9",marginTop:6}}>{label}</div>
            </div>
          ))}
        </section>

        <div style={{
          border:"1px solid rgba(148,163,184,.14)",
          borderRadius:22,
          overflow:"hidden",
          background:"rgba(10,22,41,.92)"
        }}>
          <div style={{
            padding:18,
            display:"flex",
            justifyContent:"space-between",
            gap:12,
            borderBottom:"1px solid rgba(148,163,184,.12)"
          }}>
            <strong>Kundenübersicht</strong>
            <input placeholder="Kunden suchen..." style={{
              background:"#081426",
              border:"1px solid rgba(148,163,184,.18)",
              color:"#fff",
              padding:"9px 12px",
              borderRadius:10
            }}/>
          </div>

          {customers.map((customer) => (
            <div key={customer.email} style={{
              display:"grid",
              gridTemplateColumns:"2fr 1.3fr 1.5fr 1fr .7fr 1fr",
              gap:16,
              padding:"17px 18px",
              borderBottom:"1px solid rgba(148,163,184,.08)",
              alignItems:"center"
            }}>
              <div>
                <div style={{fontWeight:800}}>{customer.name}</div>
                <div style={{fontSize:12,color:"#7f8da4"}}>{customer.contact}</div>
              </div>
              <div style={{color:"#a8b3c5"}}>{customer.city}</div>
              <div style={{color:"#a8b3c5"}}>{customer.email}</div>
              <div>{customer.jobs} Aufträge</div>
              <div style={{fontWeight:800,color:"#67e8f9"}}>{customer.revenue}</div>
              <div>
                <button style={{
                  border:"1px solid rgba(125,211,252,.22)",
                  background:"rgba(14,165,233,.08)",
                  color:"#7dd3fc",
                  padding:"8px 11px",
                  borderRadius:9,
                  fontWeight:800
                }}>
                  Öffnen →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
