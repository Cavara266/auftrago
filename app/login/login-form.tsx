"use client";

import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    const payload = {
      email: String(fd.get("email") || "").trim(),
      password: String(fd.get("password") || "").trim(),
    };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setError("E-Mail oder Passwort ist falsch.");
        return;
      }

      window.location.href = "/portal";
    } catch (error) {
      console.error(error);
      setError("Login konnte nicht durchgeführt werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label>E-Mail</label>
        <input
          name="email"
          type="email"
          placeholder="info@cavara-hauswartung.ch"
          required
        />
      </div>

      <div className="auth-field">
        <label>Passwort</label>
        <input
          name="password"
          type="password"
          placeholder="Passwort"
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Einloggen..." : "Einloggen"}
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}
    </form>
  );
}