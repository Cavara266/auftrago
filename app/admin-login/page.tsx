"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (!response.ok) {
        setError("Falsches Passwort.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Login fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-section">
        <div className="container auth-shell">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 500px",
              gap: "60px",
              alignItems: "center",
            }}
          >
            <div>
              <span className="auth-panel-badge">
                Auftrago Administration
              </span>

              <h1
                style={{
                  fontSize: "clamp(4rem, 8vw, 8rem)",
                  lineHeight: 0.9,
                  color: "white",
                  marginTop: "20px",
                  marginBottom: "24px",
                  letterSpacing: "-0.06em",
                }}
              >
                Admin
                <br />
                Bereich.
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: "1.15rem",
                  lineHeight: 1.8,
                  maxWidth: "700px",
                }}
              >
                Verwaltung von Anbietern, Leads, Credit-Käufen und
                Plattformaktivitäten. Dieser Bereich ist ausschliesslich für
                Administratoren zugänglich.
              </p>
            </div>

            <div className="auth-panel">
              <div className="auth-panel-badge">Admin Login</div>

              <h2 className="auth-panel-title">Anmelden</h2>

              <p className="auth-panel-text">
                Gib dein Admin-Passwort ein, um auf das Backend zuzugreifen.
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="password">Passwort</label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Admin Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error ? (
                  <div className="auth-error">{error}</div>
                ) : null}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{
                    width: "100%",
                  }}
                >
                  {loading ? "Einloggen..." : "Admin Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}