"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { registerAction } from "./actions";

const regions = [
  "Zürich",
  "Aargau",
  "Winterthur",
  "Baden",
  "Aarau",
  "Lenzburg",
];

const categories = [
  "Reinigung",
  "Umzug",
  "Hauswartung",
  "Transport",
  "Entsorgung",
  "Gartenbau",
];

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = useMemo(() => {
    if (!error) return "";
    if (error === "missing") return "Bitte alle Felder ausfüllen.";
    if (error === "terms") return "Bitte die Bedingungen akzeptieren.";
    if (error === "email-exists") return "Diese E-Mail ist bereits registriert.";
    return "Registrierung fehlgeschlagen.";
  }, [error]);

  return (
    <form action={registerAction} className="auth-form">
      <div className="auth-field">
        <label>Firmenname</label>
        <input
          type="text"
          name="company"
          placeholder="z. B. Cavara Reinigung GmbH"
          required
        />
      </div>

      <div className="auth-two-cols">
        <div className="auth-field">
          <label>Ansprechpartner</label>
          <input
            type="text"
            name="name"
            placeholder="Vorname / Name"
            required
          />
        </div>

        <div className="auth-field">
          <label>Telefon</label>
          <input
            type="tel"
            name="phone"
            placeholder="+41 ..."
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label>E-Mail</label>
        <input
          type="email"
          name="email"
          placeholder="firma@email.ch"
          required
        />
      </div>

      <div className="auth-two-cols">
        <div className="auth-field">
          <label>Hauptregion</label>
          <select name="region" defaultValue="" required>
            <option value="">Region wählen</option>
            {regions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="auth-field">
          <label>Hauptkategorie</label>
          <select name="category" defaultValue="" required>
            <option value="">Dienstleistung wählen</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="auth-field">
        <label>Passwort</label>
        <input
          type="password"
          name="password"
          placeholder="Passwort erstellen"
          autoComplete="new-password"
          required
        />
      </div>

      <label className="auth-checkbox-row">
        <input type="checkbox" name="accepted" required />
        <span>
          Ich akzeptiere die Bedingungen und möchte mein Anbieterprofil auf
          Auftrago registrieren.
        </span>
      </label>

      {errorMessage ? (
        <div className="auth-alert auth-alert-error">{errorMessage}</div>
      ) : null}

      <button type="submit" className="auth-submit">
        Jetzt registrieren
      </button>
    </form>
  );
}