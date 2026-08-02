"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const regions = [
  "Aargau",
  "Zürich",
  "Bern",
  "Luzern",
  "Basel",
  "Solothurn",
  "Zug",
  "St. Gallen",
];

const categories = [
  "Hauswartung",
  "Reinigung",
  "Gartenpflege",
  "Maler",
  "Gipser",
  "Sanitär",
  "Elektriker",
  "Umzug",
  "Entsorgung",
];

export default function RegisterForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      companyName: String(formData.get("companyName") || "").trim(),
      contactName: String(formData.get("contactName") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      phone: String(formData.get("phone") || "").trim(),
      region: String(formData.get("region") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    if (
      !payload.companyName ||
      !payload.contactName ||
      !payload.email ||
      !payload.region ||
      !payload.category ||
      !payload.password
    ) {
      setError("Bitte alle Pflichtfelder ausfüllen.");
      setLoading(false);
      return;
    }

    if (payload.password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen haben.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error || "Registrierung fehlgeschlagen.");
        return;
      }

      router.push("/login?message=registered");
    } catch {
      setError("Serverfehler. Bitte später erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {error ? <div className="register-error">{error}</div> : null}

      <div className="register-field">
        <label htmlFor="companyName">Firmenname *</label>
        <input
          id="companyName"
          name="companyName"
          placeholder="Cavara Hauswartung"
          autoComplete="organization"
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="contactName">Kontaktperson *</label>
        <input
          id="contactName"
          name="contactName"
          placeholder="Dejan Cavara"
          autoComplete="name"
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="email">E-Mail *</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="info@firma.ch"
          autoComplete="email"
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="phone">Telefon</label>
        <input
          id="phone"
          name="phone"
          placeholder="+41 79 123 45 67"
          autoComplete="tel"
        />
      </div>

      <div className="register-field">
        <label htmlFor="region">Region *</label>
        <select id="region" name="region" required defaultValue="">
          <option value="" disabled>
            Region auswählen
          </option>

          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="register-field">
        <label htmlFor="category">Kategorie *</label>
        <select id="category" name="category" required defaultValue="">
          <option value="" disabled>
            Kategorie auswählen
          </option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="register-field">
        <label htmlFor="password">Passwort *</label>

        <div className="register-password-row">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mindestens 6 Zeichen"
            autoComplete="new-password"
            minLength={6}
            required
          />

          <button
            type="button"
            className="register-password-toggle"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? "Ausblenden" : "Anzeigen"}
          </button>
        </div>
      </div>

      <button type="submit" className="register-submit" disabled={loading}>
        {loading ? "Wird registriert..." : "Anbieter-Konto erstellen"}
      </button>
    </form>
  );
}