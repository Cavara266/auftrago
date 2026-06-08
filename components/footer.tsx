import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <h3>Auftrago</h3>

            <p>
              Die Schweizer Plattform für Reinigung, Hauswartung, Umzug,
              Gartenpflege, Entsorgung, Transport, Fensterreinigung und
              regionale Dienstleistungen.
            </p>

            <div className="site-footer-links">
              <Link href="/offerte-anfragen">
                Kostenlose Offerte anfragen
              </Link>

              <Link href="/anbieter">
                Anbieter finden
              </Link>
            </div>
          </div>

          <div>
            <h4>Beliebte Dienstleistungen</h4>

            <div className="site-footer-links">
              <Link href="/reinigung-zuerich">
                Reinigung Zürich
              </Link>

              <Link href="/hauswartung-zuerich">
                Hauswartung Zürich
              </Link>

              <Link href="/umzug-zuerich">
                Umzug Zürich
              </Link>

              <Link href="/gartenpflege-zuerich">
                Gartenpflege Zürich
              </Link>

              <Link href="/fensterreinigung-zuerich">
                Fensterreinigung Zürich
              </Link>

              <Link href="/entsorgung-zuerich">
                Entsorgung Zürich
              </Link>
            </div>
          </div>

          <div>
            <h4>Regionen Schweiz</h4>

            <div className="site-footer-links">
              <Link href="/region">
                Alle Regionen
              </Link>

              <Link href="/region/zuerich">
                Zürich
              </Link>

              <Link href="/region/aargau">
                Aargau
              </Link>

              <Link href="/region/bern">
                Bern
              </Link>

              <Link href="/region/basel">
                Basel
              </Link>

              <Link href="/region/luzern">
                Luzern
              </Link>
            </div>
          </div>

          <div>
            <h4>Auftrago</h4>

            <div className="site-footer-links">
              <Link href="/leistungen">
                Dienstleistungen
              </Link>

              <Link href="/anbieter">
                Anbieter
              </Link>

              <Link href="/offerte-anfragen">
                Offerte anfragen
              </Link>

              <Link href="/anbieter-registrieren">
                Anbieter werden
              </Link>

              <Link href="/impressum">
                Impressum
              </Link>

              <Link href="/datenschutz">
                Datenschutz
              </Link>

              <Link href="/agb">
                AGB
              </Link>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          © {new Date().getFullYear()} Auftrago.ch – Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}