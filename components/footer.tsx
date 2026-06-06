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
              Gartenpflege, Entsorgung und regionale Dienstleistungen.
            </p>
          </div>

          <div>
            <h4>Dienstleistungen</h4>
            <div className="site-footer-links">
              <span>Reinigung</span>
              <span>Hauswartung</span>
              <span>Umzug</span>
              <span>Gartenpflege</span>
              <span>Fensterreinigung</span>
              <span>Entsorgung</span>
            </div>
          </div>

          <div>
            <h4>Regionen</h4>
            <div className="site-footer-links">
              <span>Zürich</span>
              <span>Aargau</span>
              <span>Bern</span>
              <span>Basel</span>
              <span>Luzern</span>
              <span>Schweiz</span>
            </div>
          </div>

          <div>
            <h4>Rechtliches</h4>
            <div className="site-footer-links">
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
              <Link href="/agb">AGB</Link>
              <Link href="/anbieter">Anbieter werden</Link>
              <Link href="/offerte-anfragen">Offerte anfragen</Link>
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