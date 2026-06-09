import Link from "next/link";

const popularServices = [
  ["Reinigung Zürich", "/reinigung-zuerich"],
  ["Hauswartung Zürich", "/hauswartung-zuerich"],
  ["Umzug Zürich", "/umzug-zuerich"],
  ["Gartenpflege Zürich", "/gartenpflege-zuerich"],
  ["Fensterreinigung Zürich", "/fensterreinigung-zuerich"],
  ["Entsorgung Zürich", "/entsorgung-zuerich"],
  ["Umzugsreinigung Zürich", "/umzugsreinigung-zuerich"],
  ["Büroreinigung Zürich", "/bueroreinigung-zuerich"],
];

const seoSearches = [
  ["Hauswartung Uster", "/hauswartung-uster"],
  ["Hauswartfirma Uster", "/hauswartfirma-uster"],
  ["Umzug Lenzburg", "/umzug-lenzburg"],
  ["Endreinigung Bülach", "/end-reinigung-buelach"],
  ["Büroreinigung Bülach", "/bueroreinigung-buelach"],
  ["Fensterreinigung Solothurn", "/fensterreinigung-solothurn"],
  ["Winterdienst Aargau", "/winterdienst-aargau"],
  ["Maler Dübendorf", "/maler-duebendorf"],
];

const regions = [
  ["Alle Regionen", "/region"],
  ["Zürich", "/region/zuerich"],
  ["Aargau", "/region/aargau"],
  ["Bern", "/region/bern"],
  ["Basel", "/region/basel"],
  ["Luzern", "/region/luzern"],
  ["Zug", "/region/zug"],
  ["St. Gallen", "/region/st-gallen"],
];

const companyLinks = [
  ["Dienstleistungen", "/leistungen"],
  ["Städte", "/stadt"],
  ["Anbieter finden", "/anbieter"],
  ["Offerte anfragen", "/offerte-anfragen"],
  ["Anbieter werden", "/anbieter-registrieren"],
  ["Impressum", "/impressum"],
  ["Datenschutz", "/datenschutz"],
  ["AGB", "/agb"],
];

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
              <Link href="/offerte-anfragen">Kostenlose Offerte anfragen</Link>
              <Link href="/anbieter-registrieren">Als Anbieter registrieren</Link>
            </div>
          </div>

          <div>
            <h4>Beliebte Dienstleistungen</h4>

            <div className="site-footer-links">
              {popularServices.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>SEO Suchanfragen</h4>

            <div className="site-footer-links">
              {seoSearches.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>Regionen Schweiz</h4>

            <div className="site-footer-links">
              {regions.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>Auftrago</h4>

            <div className="site-footer-links">
              {companyLinks.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
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