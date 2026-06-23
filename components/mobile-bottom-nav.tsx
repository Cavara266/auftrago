import Link from "next/link";

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <Link href="/">
        <span>🏠</span>
        <strong>Home</strong>
      </Link>

      <Link href="/auftrag-erstellen">
        <span>＋</span>
        <strong>Anfrage</strong>
      </Link>

      <Link href="/anbieter">
        <span>🔍</span>
        <strong>Anbieter</strong>
      </Link>

      <Link href="/preise">
        <span>💰</span>
        <strong>Preise</strong>
      </Link>

      <Link href="/login">
        <span>👤</span>
        <strong>Login</strong>
      </Link>
    </nav>
  );
}