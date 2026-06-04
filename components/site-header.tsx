import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          Auftrago
        </Link>

        <nav className="desktop-nav">
          <Link href="/">Startseite</Link>
          <Link href="/anbieter">Anbieter</Link>
          <Link href="/offerte-anfragen">Offerte anfragen</Link>
          <Link href="/leistungen">Leistungen</Link>
        </nav>

        <div className="desktop-actions">
          <Link href="/anbieter-registrieren" className="header-link">
            Anbieter werden
          </Link>
          <Link href="/offerte-anfragen" className="header-cta">
            Anfrage senden
          </Link>
        </div>
      </div>
    </header>
  );
}