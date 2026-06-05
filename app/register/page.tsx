import Link from "next/link";
import RegisterForm from "./register-form";

export default function Page() {
  return (
    <main className="register-page">
      <section className="register-shell">
        <div className="register-copy">
          <span className="register-kicker">Anbieter Registrierung</span>

          <h1>Firma registrieren.</h1>

          <p>
            Erstelle dein Anbieter-Konto, lade später Credits auf und kaufe
            passende Leads direkt im Portal.
          </p>

          <div className="register-benefits">
            <div>
              <strong>1. Profil erstellen</strong>
              <span>Firma, Region und Leistungen angeben.</span>
            </div>

            <div>
              <strong>2. Credits kaufen</strong>
              <span>Guthaben per Stripe aufladen.</span>
            </div>

            <div>
              <strong>3. Leads freischalten</strong>
              <span>Kontaktdaten nur bei passenden Leads kaufen.</span>
            </div>
          </div>
        </div>

        <div className="register-card">
          <h2>Jetzt registrieren</h2>
          <p>Fülle die Angaben aus und starte mit deinem Anbieterprofil.</p>

          <RegisterForm />

          <div className="register-login">
            Bereits ein Konto? <Link href="/login">Jetzt einloggen</Link>
          </div>
        </div>
      </section>
    </main>
  );
}