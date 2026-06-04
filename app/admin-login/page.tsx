"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setError("Falsches Passwort.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-section">
        <div className="container auth-shell">
          <div className="auth-panel">
            <div className="auth-panel-badge">Admin Login</div>

            <h1 className="auth-panel-title">Admin Bereich</h1>

            <p className="auth-panel-text">
              Bitte Admin-Passwort eingeben.
            </p>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                className="input"
                type="password"
                placeholder="Admin Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="btn btn-primary" type="submit">
                Einloggen
              </button>
            </form>

            {error && (
              <p className="text-red-400 mt-4">
                {error}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}