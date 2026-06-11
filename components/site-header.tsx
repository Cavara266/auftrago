import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand brand-with-logo">
          <span className="brand-flame-wrap">
            <Image
              src="/logo-flame.svg"
              alt="Auftrago Logo"
              width={34}
              height={34}
              priority
              className="brand-flame"
            />
          </span>

          <span>Auftrago</span>
        </Link>

        <nav className="desktop-nav">
          <Link href="/">Startseite</Link>
          <Link href="/anbieter">Anbieter</Link>

          <Link
            href="/preisrechner"
            style={{
              color: "#10b981",
              fontWeight: 900,
            }}
          >
            💰 Preisrechner
          </Link>

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