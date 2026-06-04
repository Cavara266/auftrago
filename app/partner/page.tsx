export default function PartnerPage() {
  return (
    <main className="page">

      {/* HERO */}
      <section className="section container">
        <span className="eyebrow">Für Anbieter</span>

        <h1>
          Mehr Kunden.
          <br />
          Weniger Aufwand.
        </h1>

        <p>
          Auftrago bringt dir nicht einfach Kontakte – sondern echte, konkrete
          Kundenanfragen von Menschen, die aktiv nach deiner Dienstleistung suchen.
          Du verschwendest keine Zeit mehr mit Werbung, Kaltakquise oder unnötigen
          Gesprächen.
        </p>

        <p>
          Stattdessen bekommst du strukturierte Anfragen, die genau zu deinem
          Angebot passen. Mehr Effizienz, bessere Kunden und deutlich höhere
          Abschlusschancen.
        </p>

        <div className="actions">
          <a href="/register" className="btn btn-primary">
            Anbieter-Anfrage starten
          </a>
          <a href="/preise" className="btn btn-secondary">
            Preise ansehen
          </a>
        </div>

        <div className="trust-row">
          <span>Nur echte Anfragen</span>
          <span>Regionale Kunden</span>
          <span>Keine Kaltakquise</span>
          <span>Volle Kontrolle</span>
        </div>
      </section>

      {/* LEAD SYSTEM + ORBIT DIAGRAM */}
      <section className="section container">
        <div className="lead-system-card">

          {/* TEXT */}
          <div className="lead-system-copy">
            <span className="eyebrow">Lead-System</span>

            <h2>
              Mehr Anfragen.
              <br />
              Weniger Streuverlust.
            </h2>

            <p>
              Unser System analysiert jede einzelne Anfrage in Echtzeit und filtert
              automatisch nach Region, Kategorie und Bedarf. Dadurch erhältst du
              nur Anfragen, die wirklich zu deinem Unternehmen passen.
            </p>

            <p>
              Keine unnötigen Kontakte mehr, keine Zeitverschwendung – sondern
              gezielte Leads mit klaren Informationen und hoher Abschlusschance.
            </p>

            <p>
              Das bedeutet für dich: mehr Umsatz, weniger Aufwand und ein klar
              strukturierter Kundenfluss.
            </p>
          </div>

          {/* GEILES ORBIT DIAGRAM */}
          <div className="lead-orbit">

            <div className="orbit-ring ring-one"></div>
            <div className="orbit-ring ring-two"></div>

            <div className="orbit-core">
              <strong>Auftrago</strong>
              <span>Matching System</span>
            </div>

            <div className="orbit-node node-one">
              <strong>01</strong>
              <span>Region</span>
            </div>

            <div className="orbit-node node-two">
              <strong>02</strong>
              <span>Kategorie</span>
            </div>

            <div className="orbit-node node-three">
              <strong>03</strong>
              <span>Bedarf</span>
            </div>

          </div>

        </div>
      </section>

      {/* VORTEILE */}
      <section className="section container">
        <h2>Warum Anbieter Auftrago nutzen</h2>

        <p style={{ maxWidth: 700 }}>
          Auftrago wurde speziell für Dienstleister entwickelt, die nicht einfach
          mehr Sichtbarkeit wollen – sondern bessere Kunden. Unser System sorgt
          dafür, dass du nur relevante Anfragen erhältst und deine Zeit optimal
          nutzt.
        </p>

        <div className="grid-3">
          <div className="service-card">
            <h3>Regionale Kunden</h3>
            <p>
              Du erhältst nur Anfragen aus deinem Einsatzgebiet. Keine unnötigen
              Fahrten und kein Zeitverlust.
            </p>
          </div>

          <div className="service-card">
            <h3>Keine Werbung nötig</h3>
            <p>
              Keine Google Ads, keine Flyer, keine Kaltakquise. Kunden kommen
              direkt zu dir.
            </p>
          </div>

          <div className="service-card">
            <h3>Mehr Abschlüsse</h3>
            <p>
              Passende Anfragen bedeuten höhere Abschlussquoten und besseren Umsatz.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section container">
        <div className="split-card panel">

          <div>
            <h2>So funktioniert es</h2>

            <p>
              Kunden beschreiben ihren Auftrag in wenigen Sekunden. Unser System
              analysiert alle Angaben automatisch und verteilt die Anfrage nur an
              passende Anbieter.
            </p>

            <p>
              Du erhältst sofort strukturierte Leads mit allen wichtigen Infos –
              ohne Nachfragen, ohne Chaos.
            </p>

            <p>
              Du entscheidest selbst, welche Anfragen du annimmst und behältst
              jederzeit die volle Kontrolle.
            </p>
          </div>

          <div className="grid-3">
            <div className="stat-card">
              <h3>01</h3>
              <p>Region wird geprüft</p>
            </div>

            <div className="stat-card">
              <h3>02</h3>
              <p>Kategorie wird gefiltert</p>
            </div>

            <div className="stat-card">
              <h3>03</h3>
              <p>Nur passende Leads werden gesendet</p>
            </div>
          </div>

        </div>
      </section>

      {/* TRUST / TEXT BOOST */}
      <section className="section container">
        <h2>Mehr als nur Leads</h2>

        <p style={{ maxWidth: 800 }}>
          Auftrago ist kein klassisches Werbeportal. Es ist ein System, das gezielt
          hochwertige Kundenanfragen generiert und effizient verteilt.
        </p>

        <p style={{ maxWidth: 800 }}>
          Statt Streuverlust bekommst du klare Chancen. Statt Aufwand bekommst du
          Struktur. Und statt Unsicherheit bekommst du echte Ergebnisse.
        </p>
      </section>

      {/* CTA */}
      <section className="final container">
        <div className="final-card panel">
          <h2>
            Starte jetzt und sichere dir
            <br />
            regelmässige Kundenanfragen.
          </h2>

          <p>
            Werde Teil des Auftrago Netzwerks und profitiere von einem System,
            das dir konstant neue Kunden bringt – ohne Aufwand.
          </p>

          <div className="actions">
            <a href="/register" className="btn btn-primary">
              Jetzt registrieren
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}