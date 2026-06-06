export const metadata = {
  title: "Impressum | Auftrago",
  description: "Impressum der Plattform Auftrago.ch",
};

export default function ImpressumPage() {
  return (
    <main className="page">
      <section className="premium-section">
        <div
          className="container"
          style={{
            maxWidth: "900px",
          }}
        >
          <div className="premium-provider-card">
            <span className="eyebrow">Rechtliches</span>

            <h1>Impressum</h1>

            <p>
              Angaben gemäss Art. 3 Abs. 1 lit. s UWG (Schweiz).
            </p>

            <h2>Betreiber der Plattform</h2>

            <p>
              <strong>Auftrago.ch</strong>
              <br />
              5507 Mellingen
              <br />
              Schweiz
            </p>

            <h2>Verantwortliche Person</h2>

            <p>
              Cavara
            </p>

            <h2>Kontakt</h2>

            <p>
              E-Mail:
              <br />
              <a href="mailto:info@cavara-hauswartung.ch">
                info@cavara-hauswartung.ch
              </a>
            </p>

            <h2>Haftungsausschluss</h2>

            <p>
              Die Inhalte dieser Website werden mit grösster Sorgfalt erstellt.
              Dennoch übernimmt Auftrago keine Gewähr für die Richtigkeit,
              Vollständigkeit und Aktualität der bereitgestellten Informationen.
            </p>

            <p>
              Auftrago vermittelt Anfragen zwischen Kunden und Anbietern.
              Verträge kommen ausschliesslich zwischen dem jeweiligen Kunden
              und dem Anbieter zustande.
            </p>

            <h2>Urheberrechte</h2>

            <p>
              Sämtliche Inhalte, Texte, Bilder, Grafiken und Designelemente
              dieser Website sind urheberrechtlich geschützt. Jegliche
              Verwendung ohne schriftliche Zustimmung ist untersagt.
            </p>

            <h2>Haftung für Links</h2>

            <p>
              Diese Website kann Links zu externen Webseiten enthalten.
              Für deren Inhalte sind ausschliesslich die jeweiligen Betreiber
              verantwortlich.
            </p>

            <h2>Gerichtsstand</h2>

            <p>
              Es gilt ausschliesslich schweizerisches Recht.
              Gerichtsstand ist Mellingen AG, soweit gesetzlich zulässig.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}