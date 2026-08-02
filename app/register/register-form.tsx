"use client";

import {
  useState,
  type FormEvent,
} from "react";

const regions = [
  "Aargau",
  "Zürich",
  "Bern",
  "Luzern",
  "Basel",
  "Solothurn",
  "Zug",
  "St. Gallen",
  "Thurgau",
  "Schaffhausen",
  "Schwyz",
  "Glarus",
  "Graubünden",
  "Tessin",
  "Waadt",
  "Genf",
  "Wallis",
  "Neuenburg",
  "Jura",
  "Freiburg",
  "Nidwalden",
  "Obwalden",
  "Uri",
  "Appenzell Ausserrhoden",
  "Appenzell Innerrhoden",
  "Gesamte Schweiz",
];

const categories = [
  "Hauswartung",
  "Reinigung",
  "Umzugsreinigung",
  "Unterhaltsreinigung",
  "Fensterreinigung",
  "Gartenpflege",
  "Maler",
  "Gipser",
  "Sanitär",
  "Elektriker",
  "Umzug",
  "Transport",
  "Entsorgung",
  "Immobilien",
  "Treuhand",
  "Versicherungen",
  "Solaranlagen",
  "Wärmepumpen",
  "Andere Dienstleistung",
];

type RegistrationResponse = {
  ok?: boolean;
  error?: string;
  checkoutUrl?: string;
  redirectUrl?: string;
};

export default function RegisterForm() {
  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(
      event.currentTarget,
    );

    const payload = {
      companyName: String(
        formData.get("companyName") || "",
      ).trim(),

      contactName: String(
        formData.get("contactName") || "",
      ).trim(),

      email: String(
        formData.get("email") || "",
      )
        .trim()
        .toLowerCase(),

      phone: String(
        formData.get("phone") || "",
      ).trim(),

      region: String(
        formData.get("region") || "",
      ).trim(),

      category: String(
        formData.get("category") || "",
      ).trim(),

      password: String(
        formData.get("password") || "",
      ),
    };

    if (
      !payload.companyName ||
      !payload.contactName ||
      !payload.email ||
      !payload.region ||
      !payload.category ||
      !payload.password
    ) {
      setError(
        "Bitte alle Pflichtfelder ausfüllen.",
      );

      setLoading(false);
      return;
    }

    if (payload.password.length < 8) {
      setError(
        "Das Passwort muss mindestens 8 Zeichen haben.",
      );

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const data =
        (await response.json()) as RegistrationResponse;

      if (!response.ok || !data.ok) {
        setError(
          data.error ||
            "Registrierung fehlgeschlagen.",
        );

        return;
      }

      if (data.checkoutUrl) {
        window.location.assign(
          data.checkoutUrl,
        );

        return;
      }

      window.location.assign(
        data.redirectUrl ||
          "/subscription-required",
      );
    } catch {
      setError(
        "Serverfehler. Bitte später erneut versuchen.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="register-form"
    >
      {error ? (
        <div className="register-error">
          {error}
        </div>
      ) : null}

      <div className="register-field">
        <label htmlFor="companyName">
          Firmenname *
        </label>

        <input
          id="companyName"
          name="companyName"
          placeholder="Cavara Hauswartung"
          autoComplete="organization"
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="contactName">
          Kontaktperson *
        </label>

        <input
          id="contactName"
          name="contactName"
          placeholder="Dejan Cavara"
          autoComplete="name"
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="email">
          E-Mail *
        </label>

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
        <label htmlFor="phone">
          Telefon
        </label>

        <input
          id="phone"
          name="phone"
          placeholder="+41 79 123 45 67"
          autoComplete="tel"
        />
      </div>

      <div className="register-field">
        <label htmlFor="region">
          Hauptregion *
        </label>

        <select
          id="region"
          name="region"
          required
          defaultValue=""
        >
          <option
            value=""
            disabled
          >
            Region auswählen
          </option>

          {regions.map((region) => (
            <option
              key={region}
              value={region}
            >
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="register-field">
        <label htmlFor="category">
          Hauptdienstleistung *
        </label>

        <select
          id="category"
          name="category"
          required
          defaultValue=""
        >
          <option
            value=""
            disabled
          >
            Dienstleistung auswählen
          </option>

          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="register-field">
        <label htmlFor="password">
          Passwort *
        </label>

        <div className="register-password-row">
          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Mindestens 8 Zeichen"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button
            type="button"
            className="register-password-toggle"
            onClick={() =>
              setShowPassword(
                (current) => !current,
              )
            }
          >
            {showPassword
              ? "Ausblenden"
              : "Anzeigen"}
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "16px",
          padding: "15px",
          border:
            "1px solid rgba(245, 191, 73, 0.22)",
          borderRadius: "13px",
          background:
            "rgba(245, 191, 73, 0.06)",
          color: "#c8ccd5",
          fontSize: "13px",
          lineHeight: 1.65,
        }}
      >
        <strong
          style={{
            display: "block",
            color: "#f2ca68",
            marginBottom: "5px",
          }}
        >
          14 Tage kostenlos testen
        </strong>

        Danach CHF 69.– pro Monat.
        Die Zahlungsmethode wird sicher über
        Stripe hinterlegt. Das Abonnement kann
        online verwaltet werden.
      </div>

      <button
        type="submit"
        className="register-submit"
        disabled={loading}
      >
        {loading
          ? "Konto wird erstellt..."
          : "Konto erstellen und kostenlos testen"}
      </button>
    </form>
  );
}
