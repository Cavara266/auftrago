import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>Auftrago</h3>

            <p>
              Die Schweizer Plattform für Reinigung, Hauswartung,
              Umzug, Gartenpflege, Entsorgung und regionale
              Dienstleistungen.
            </p>
          </div>

          <div>
            <h4>Dienstleistungen</h4>

            <ul>
              <li>Reinigung</li>
              <li>Hauswartung</li>
              <li>Umzug</li>
              <li>Gartenpflege</li>
              <li>Fensterreinigung</li>
              <li>Entsorgung</li>
            </ul>
          </div>

          <div>
            <h4>Regionen</h4>

            <ul>
              <li>Zürich</li>
              <li>Aargau</li>
              <li>Bern</li>
              <li>Basel</li>
              <li>Luzern</li>
              <li>Schweiz</li>
            </ul>
          </div>

          <div>
            <h4>Links</h4>

            <ul>
              <li>
                <Link href="/impressum">Impressum</Link>
              </li>

              <li>
                <Link href="/datenschutz">Datenschutz</Link>
              </li>

              <li>
                <Link href="/agb">AGB</Link>
              </li>

              <li>
                <Link href="/anbieter">
                  Anbieter werden
                </Link>
              </li>

              <li>
                <Link href="/offerte-anfragen">
                  Offerte anfragen
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Auftrago.ch – Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}