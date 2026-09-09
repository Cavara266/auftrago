import Link from "next/link";

const packages = [
  {
    name: "START",
    price: "CHF 990.–",
    subtitle: "Dein professioneller Webauftritt.",
    description:
      "Ideal für Unternehmen, die schnell eine moderne und überzeugende Webseite benötigen.",
    features: [
      "Professionelle Firmenwebseite",
      "Optimiert für Smartphone & Desktop",
      "Startseite & Leistungsübersicht",
      "Kontaktformular",
      "WhatsApp Integration",
      "Impressum & Datenschutz",
      "Modernes Premium Design",
      "Technische Grundoptimierung",
    ],
    featured: false,
  },
  {
    name: "BUSINESS",
    price: "CHF 1'990.–",
    subtitle: "Mehr Seiten. Mehr Vertrauen. Mehr Kunden.",
    description:
      "Für Unternehmen, die professionell auftreten und bei Google eine starke Grundlage schaffen möchten.",
    features: [
      "Alles aus START",
      "Mehrere Leistungsseiten",
      "Individuelle Unternehmensdarstellung",
      "Basis Suchmaschinenoptimierung",
      "Google-freundliche Seitenstruktur",
      "Regionale Ausrichtung",
      "Conversion-optimierte Kontaktbereiche",
      "Performance Optimierung",
      "Google Maps Integration",
      "Professionelle Call-to-Actions",
    ],
    featured: true,
  },
  {
    name: "SEO PRO",
    price: "CHF 3'490.–",
    subtitle: "Gebaut, um bei Google anzugreifen.",
    description:
      "Unsere stärkste Lösung für Dienstleister, die langfristig eigene Kunden über Google gewinnen wollen.",
    features: [
      "Alles aus BUSINESS",
      "Umfangreiche SEO-Struktur",
      "Lokale SEO Landingpages",
      "Optimierung nach Dienstleistungen",
      "Optimierung nach Regionen",
      "Keyword-Struktur",
      "Technische SEO",
      "Meta Titles & Descriptions",
      "Interne Verlinkungsstruktur",
      "Conversion Optimierung",
      "Google Search Console Vorbereitung",
      "Skalierbare SEO Architektur",
    ],
    featured: false,
  },
];

export default function WebsiteSeoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 5%, rgba(116,72,255,.18), transparent 28%), radial-gradient(circle at 10% 20%, rgba(0,191,255,.10), transparent 28%), #050b18",
        color: "#f8fafc",
        padding: "60px 28px 100px",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <section style={{ textAlign: "center", padding: "50px 0 70px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(56,189,248,.3)",
              background: "rgba(56,189,248,.08)",
              color: "#7dd3fc",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".12em",
            }}
          >
            🌐 AUFTRAGO WEB · NEU
          </div>

          <h1
            style={{
              fontSize: "clamp(42px,6vw,78px)",
              lineHeight: 1,
              margin: "25px auto 22px",
              maxWidth: 1000,
              letterSpacing: "-.045em",
            }}
          >
            Deine Webseite soll nicht nur gut aussehen.
            <span
              style={{
                display: "block",
                background: "linear-gradient(90deg,#38bdf8,#818cf8,#c084fc)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Sie soll Kunden bringen.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 780,
              margin: "0 auto",
              color: "#94a3b8",
              fontSize: 19,
              lineHeight: 1.7,
            }}
          >
            Professionelle Webseiten für Schweizer Unternehmen – von der
            modernen Firmenwebseite bis zur umfangreichen SEO-Plattform für
            mehr Sichtbarkeit bei Google.
          </p>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href="#pakete"
              style={{
                padding: "15px 24px",
                borderRadius: 12,
                background: "linear-gradient(90deg,#0ea5e9,#7c3aed)",
                color: "white",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Pakete ansehen →
            </a>

            <Link
              href="/portal"
              style={{
                padding: "15px 24px",
                borderRadius: 12,
                border: "1px solid #26344f",
                color: "#cbd5e1",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Zurück zum Portal
            </Link>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
            gap: 12,
            marginBottom: 70,
          }}
        >
          {[
            ["⚡", "Schnelle Umsetzung"],
            ["📱", "Mobile optimiert"],
            ["🎯", "Auf Kunden ausgelegt"],
            ["🔎", "SEO verfügbar"],
          ].map(([icon, text]) => (
            <div
              key={text}
              style={{
                padding: 20,
                borderRadius: 16,
                background: "rgba(15,23,42,.72)",
                border: "1px solid #1e293b",
                textAlign: "center",
                fontWeight: 750,
              }}
            >
              <div style={{ fontSize: 25, marginBottom: 8 }}>{icon}</div>
              {text}
            </div>
          ))}
        </section>

        <section id="pakete">
          <div style={{ textAlign: "center", marginBottom: 38 }}>
            <div
              style={{
                color: "#38bdf8",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: ".12em",
              }}
            >
              DEINE WEBSITE. DEIN WACHSTUM.
            </div>
            <h2
              style={{
                fontSize: "clamp(32px,4vw,50px)",
                margin: "10px 0",
                letterSpacing: "-.035em",
              }}
            >
              Wähle dein Paket
            </h2>
            <p style={{ color: "#94a3b8" }}>
              Klare Preise. Professionelle Umsetzung. Für Schweizer
              Dienstleistungsunternehmen.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 18,
              alignItems: "stretch",
            }}
          >
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                style={{
                  position: "relative",
                  padding: 30,
                  borderRadius: 24,
                  background: pkg.featured
                    ? "linear-gradient(145deg,rgba(14,165,233,.13),rgba(124,58,237,.16))"
                    : "rgba(10,18,35,.82)",
                  border: pkg.featured
                    ? "1px solid rgba(96,165,250,.65)"
                    : "1px solid #1e293b",
                  boxShadow: pkg.featured
                    ? "0 20px 70px rgba(79,70,229,.18)"
                    : "none",
                }}
              >
                {pkg.featured && (
                  <div
                    style={{
                      position: "absolute",
                      right: 18,
                      top: 18,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "#2563eb",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    BELIEBT
                  </div>
                )}

                <div
                  style={{
                    color: pkg.featured ? "#7dd3fc" : "#a78bfa",
                    fontWeight: 900,
                    letterSpacing: ".1em",
                    fontSize: 13,
                  }}
                >
                  {pkg.name}
                </div>

                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    marginTop: 16,
                    letterSpacing: "-.04em",
                  }}
                >
                  {pkg.price}
                </div>

                <h3 style={{ marginTop: 18, fontSize: 20 }}>{pkg.subtitle}</h3>

                <p
                  style={{
                    color: "#94a3b8",
                    lineHeight: 1.65,
                    minHeight: 78,
                  }}
                >
                  {pkg.description}
                </p>

                <div
                  style={{
                    height: 1,
                    background: "#1e293b",
                    margin: "24px 0",
                  }}
                />

                <div style={{ display: "grid", gap: 13 }}>
                  {pkg.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        display: "flex",
                        gap: 10,
                        color: "#dbeafe",
                        fontSize: 14,
                      }}
                    >
                      <span style={{ color: "#34d399" }}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={`mailto:info@auftrago.ch?subject=${encodeURIComponent(
                    `Auftrago Web – ${pkg.name}`
                  )}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 30,
                    padding: "15px 18px",
                    borderRadius: 12,
                    textDecoration: "none",
                    color: "white",
                    fontWeight: 850,
                    background: pkg.featured
                      ? "linear-gradient(90deg,#0ea5e9,#7c3aed)"
                      : "#16233b",
                    border: "1px solid #2b3a55",
                  }}
                >
                  {pkg.name} anfragen →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 80,
            padding: "45px 35px",
            borderRadius: 26,
            border: "1px solid #25334c",
            background:
              "linear-gradient(120deg,rgba(14,165,233,.08),rgba(124,58,237,.12))",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#34d399",
                  fontWeight: 850,
                  fontSize: 12,
                  letterSpacing: ".1em",
                }}
              >
                AUFTRAGO SEO
              </div>
              <h2
                style={{
                  fontSize: 38,
                  margin: "10px 0",
                  letterSpacing: "-.035em",
                }}
              >
                Gefunden werden, wenn Kunden suchen.
              </h2>
              <p style={{ color: "#a7b2c5", lineHeight: 1.75 }}>
                Eine schöne Webseite ist der Anfang. Mit SEO schaffen wir die
                technische und inhaltliche Grundlage dafür, dass dein
                Unternehmen bei relevanten Google-Suchen sichtbar werden kann.
              </p>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Lokale Suchmaschinenoptimierung",
                "Dienstleistungs- & Regionsseiten",
                "Technische SEO-Struktur",
                "Keyword-orientierte Inhalte",
                "Google Search Console Vorbereitung",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "rgba(3,9,20,.55)",
                    border: "1px solid #22304a",
                  }}
                >
                  <span style={{ color: "#34d399", marginRight: 10 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ textAlign: "center", padding: "90px 20px 20px" }}>
          <div style={{ fontSize: 13, color: "#818cf8", fontWeight: 900 }}>
            BEREIT FÜR DEN NÄCHSTEN SCHRITT?
          </div>
          <h2
            style={{
              fontSize: "clamp(34px,5vw,58px)",
              margin: "12px auto",
              maxWidth: 850,
            }}
          >
            Mach deine Webseite zu deinem stärksten Verkäufer.
          </h2>
          <p
            style={{
              color: "#94a3b8",
              maxWidth: 650,
              margin: "0 auto 28px",
              lineHeight: 1.7,
            }}
          >
            Auftrago Web entwickelt moderne Webseiten für Unternehmen, die
            professioneller auftreten und mehr Kunden erreichen möchten.
          </p>
          <a
            href="mailto:info@auftrago.ch?subject=Ich%20interessiere%20mich%20für%20Auftrago%20Web"
            style={{
              display: "inline-block",
              padding: "17px 28px",
              borderRadius: 13,
              background: "linear-gradient(90deg,#0ea5e9,#7c3aed)",
              color: "white",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            Webseite jetzt anfragen →
          </a>
        </section>
      </div>
    </main>
  );
}
