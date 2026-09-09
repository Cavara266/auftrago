import Link from "next/link";

const stats = [["38", "Fotos"], ["12", "Dokumente"], ["7", "Abnahmen"], ["100 %", "Dokumentiert"]];
const items = [["AUF-1048", "Umzugsreinigung Zürich", "12 Fotos", "Vollständig"], ["AUF-1047", "Hauswartung Baden", "6 Fotos", "Vollständig"], ["AUF-1046", "Fensterreinigung Aarau", "8 Fotos", "Abnahme offen"]];

export default function Page() {
  return (
    <main style={{
      minHeight:"100vh",
      padding:36,
      color:"#fff",
      background:"radial-gradient(circle at 85% 0%,rgba(124,58,237,.17),transparent 28%),#06101f"
    }}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          gap:20,
          flexWrap:"wrap"
        }}>
          <div>
            <div style={{color:"#67e8f9",fontSize:12,fontWeight:900}}>
              AUFTRAGO BUSINESS / AUFTRAGSDOKUMENTATION
            </div>
            <h1 style={{fontSize:44,margin:"8px 0"}}>Dokumentation</h1>
            <p style={{color:"#91a0b7",fontSize:16,maxWidth:720}}>
              Fotos, Notizen, Abnahmen und Nachweise sicher beim Auftrag speichern.
            </p>
          </div>

          <button style={{
            border:0,
            cursor:"pointer",
            color:"#fff",
            padding:"14px 20px",
            borderRadius:12,
            fontWeight:900,
            background:"linear-gradient(90deg,#0ea5e9,#7c3aed)",
            boxShadow:"0 10px 35px rgba(124,58,237,.2)"
          }}>
            + Dokumentation
          </button>
        </div>

        <section style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",
          gap:14,
          margin:"30px 0"
        }}>
          {stats.map(([value,label]) => (
            <div key={label} style={{
              padding:22,
              borderRadius:18,
              background:"rgba(12,27,49,.92)",
              border:"1px solid rgba(148,163,184,.14)"
            }}>
              <div style={{fontSize:26,fontWeight:900}}>{value}</div>
              <div style={{color:"#8291a9",marginTop:7}}>{label}</div>
            </div>
          ))}
        </section>

        <section style={{
          borderRadius:22,
          overflow:"hidden",
          border:"1px solid rgba(148,163,184,.14)",
          background:"rgba(10,22,41,.94)"
        }}>
          <div style={{
            padding:"19px 21px",
            borderBottom:"1px solid rgba(148,163,184,.1)",
            display:"flex",
            justifyContent:"space-between"
          }}>
            <strong>Aktuelle Übersicht</strong>
            <span style={{color:"#64748b"}}>Auftrago Business</span>
          </div>

          {items.map((row,index) => (
            <div key={index} style={{
              display:"grid",
              gridTemplateColumns:"1fr 2fr 1.2fr 1fr",
              gap:18,
              padding:"19px 21px",
              alignItems:"center",
              borderBottom:"1px solid rgba(148,163,184,.08)"
            }}>
              {row.map((value,i) => (
                <div key={i} style={{
                  fontWeight:i===0 ? 800 : 600,
                  color:i===3 ? "#7dd3fc" : i===0 ? "#fff" : "#a8b3c5"
                }}>
                  {value}
                </div>
              ))}
            </div>
          ))}
        </section>

        <section style={{
          marginTop:24,
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
          gap:16
        }}>
          <div style={{
            padding:25,
            borderRadius:20,
            border:"1px solid rgba(167,139,250,.2)",
            background:"linear-gradient(135deg,rgba(124,58,237,.12),rgba(14,165,233,.07))"
          }}>
            <div style={{color:"#c4b5fd",fontWeight:900}}>✨ AUFTRAGO AI</div>
            <h3>Intelligent automatisieren</h3>
            <p style={{color:"#91a0b7",lineHeight:1.6}}>
              Auftrago AI analysiert deine Geschäftsdaten und zeigt dir,
              wo du Zeit sparst und schneller Umsatz realisieren kannst.
            </p>
          </div>

          <div style={{
            padding:25,
            borderRadius:20,
            border:"1px solid rgba(148,163,184,.14)",
            background:"rgba(12,27,49,.88)"
          }}>
            <div style={{color:"#67e8f9",fontWeight:900}}>BUSINESS PRO</div>
            <h3>Alles miteinander verbunden.</h3>
            <p style={{color:"#91a0b7",lineHeight:1.6}}>
              Kunde → Offerte → Auftrag → Dokumentation → Rechnung → Zahlung.
            </p>
            <Link href="/portal/business" style={{
              color:"#7dd3fc",
              fontWeight:800,
              textDecoration:"none"
            }}>
              ← Business Cockpit
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
